/**
 * Zoho API Client Service
 * Handles OAuth token management and API calls to Zoho CRM, Books, and Desk
 */

import axios, { AxiosInstance } from 'axios';

// Zoho endpoints - US datacenter (default)
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
const ZOHO_CRM_URL = process.env.ZOHO_CRM_URL || 'https://www.zohoapis.com/crm/v2';
const ZOHO_BOOKS_URL = process.env.ZOHO_BOOKS_URL || 'https://www.zohoapis.com/books/v3';
const ZOHO_DESK_URL = process.env.ZOHO_DESK_URL || 'https://desk.zoho.com/api/v1';

// Token cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
    };
}

interface OrderData {
    orderId: string;
    contactId?: string;
    customerEmail: string;
    items: Array<{
        productId: string;
        name: string;
        sku: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: CustomerData['address'];
}

interface TicketData {
    subject: string;
    description: string;
    contactId?: string;
    email: string;
    category?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

class ZohoClient {
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;
    private orgId: string;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.clientId = process.env.ZOHO_CLIENT_ID || '';
        this.clientSecret = process.env.ZOHO_CLIENT_SECRET || '';
        this.refreshToken = process.env.ZOHO_REFRESH_TOKEN || '';
        this.orgId = process.env.ZOHO_ORG_ID || '';

        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Check if Zoho integration is configured
     */
    isConfigured(): boolean {
        return !!(this.clientId && this.clientSecret && this.refreshToken);
    }

    /**
     * Refresh OAuth access token
     */
    async refreshAccessToken(): Promise<string> {
        if (!this.isConfigured()) {
            throw new Error('Zoho API credentials not configured');
        }

        // Return cached token if not expired
        if (accessToken && Date.now() < tokenExpiry) {
            return accessToken;
        }

        try {
            const response = await axios.post(
                `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
                null,
                {
                    params: {
                        refresh_token: this.refreshToken,
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        grant_type: 'refresh_token',
                    },
                }
            );

            accessToken = response.data.access_token;
            // Token expires in 1 hour, refresh 5 minutes early
            tokenExpiry = Date.now() + (55 * 60 * 1000);

            return accessToken!;
        } catch (error: any) {
            console.error('Zoho token refresh failed:', error.response?.data || error.message);
            throw new Error('Failed to refresh Zoho access token');
        }
    }

    /**
     * Get authenticated headers
     */
    private async getAuthHeaders() {
        const token = await this.refreshAccessToken();
        return {
            Authorization: `Zoho-oauthtoken ${token}`,
        };
    }

    // ==================== CRM OPERATIONS ====================

    /**
     * Create or update a contact in Zoho CRM
     */
    async upsertContact(customer: CustomerData): Promise<string> {
        const headers = await this.getAuthHeaders();

        const contactData = {
            data: [
                {
                    First_Name: customer.firstName,
                    Last_Name: customer.lastName,
                    Email: customer.email,
                    Phone: customer.phone,
                    Mailing_Street: customer.address?.street,
                    Mailing_City: customer.address?.city,
                    Mailing_State: customer.address?.state,
                    Mailing_Zip: customer.address?.zipCode,
                    Mailing_Country: customer.address?.country || 'India',
                    Lead_Source: 'Website',
                },
            ],
            duplicate_check_fields: ['Email'],
        };

        try {
            const response = await this.axiosInstance.post(
                `${ZOHO_CRM_URL}/Contacts/upsert`,
                contactData,
                { headers }
            );

            const result = response.data.data?.[0];
            if (result?.code === 'SUCCESS') {
                return result.details.id;
            }

            throw new Error(result?.message || 'Failed to create contact');
        } catch (error: any) {
            console.error('CRM contact upsert failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Create a deal (order) in Zoho CRM
     */
    async createDeal(order: OrderData, contactId?: string): Promise<string> {
        const headers = await this.getAuthHeaders();

        const dealData = {
            data: [
                {
                    Deal_Name: `Order #${order.orderId}`,
                    Amount: order.total,
                    Stage: 'New Order',
                    Closing_Date: new Date().toISOString().split('T')[0],
                    Contact_Name: contactId || null,
                    Description: `Order containing ${order.items.length} item(s)`,
                    // Custom fields (create these in CRM first)
                    Order_ID: order.orderId,
                    Shipping_Amount: order.shipping,
                    Tax_Amount: order.tax,
                },
            ],
        };

        try {
            const response = await this.axiosInstance.post(
                `${ZOHO_CRM_URL}/Deals`,
                dealData,
                { headers }
            );

            const result = response.data.data?.[0];
            if (result?.code === 'SUCCESS') {
                return result.details.id;
            }

            throw new Error(result?.message || 'Failed to create deal');
        } catch (error: any) {
            console.error('CRM deal creation failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Update deal stage
     */
    async updateDealStage(dealId: string, stage: string): Promise<void> {
        const headers = await this.getAuthHeaders();

        const updateData = {
            data: [
                {
                    id: dealId,
                    Stage: stage,
                },
            ],
        };

        await this.axiosInstance.put(`${ZOHO_CRM_URL}/Deals`, updateData, { headers });
    }

    // ==================== BOOKS OPERATIONS ====================

    /**
     * Create or get customer in Zoho Books
     */
    async upsertBooksCustomer(customer: CustomerData): Promise<string> {
        const headers = await this.getAuthHeaders();

        // First try to find existing customer
        try {
            const searchResponse = await this.axiosInstance.get(
                `${ZOHO_BOOKS_URL}/contacts`,
                {
                    headers,
                    params: {
                        organization_id: this.orgId,
                        email: customer.email,
                    },
                }
            );

            const existingCustomer = searchResponse.data.contacts?.[0];
            if (existingCustomer) {
                return existingCustomer.contact_id;
            }
        } catch (error) {
            // Customer not found, create new one
        }

        // Create new customer
        const customerData = {
            contact_name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone,
            billing_address: {
                street: customer.address?.street,
                city: customer.address?.city,
                state: customer.address?.state,
                zip: customer.address?.zipCode,
                country: customer.address?.country || 'India',
            },
            shipping_address: {
                street: customer.address?.street,
                city: customer.address?.city,
                state: customer.address?.state,
                zip: customer.address?.zipCode,
                country: customer.address?.country || 'India',
            },
            contact_type: 'customer',
        };

        const response = await this.axiosInstance.post(
            `${ZOHO_BOOKS_URL}/contacts`,
            customerData,
            {
                headers,
                params: { organization_id: this.orgId },
            }
        );

        return response.data.contact.contact_id;
    }

    /**
     * Create invoice in Zoho Books
     */
    async createInvoice(order: OrderData, customerId: string): Promise<string> {
        const headers = await this.getAuthHeaders();

        const lineItems = order.items.map(item => ({
            name: item.name,
            description: `SKU: ${item.sku}`,
            rate: item.price,
            quantity: item.quantity,
        }));

        // Add shipping as line item if applicable
        if (order.shipping > 0) {
            lineItems.push({
                name: 'Shipping & Handling',
                description: 'Delivery charges',
                rate: order.shipping,
                quantity: 1,
            });
        }

        const invoiceData = {
            customer_id: customerId,
            reference_number: order.orderId,
            line_items: lineItems,
            notes: `Order #${order.orderId} placed on Bluewud website`,
            terms: 'Thank you for shopping with Bluewud!',
        };

        try {
            const response = await this.axiosInstance.post(
                `${ZOHO_BOOKS_URL}/invoices`,
                invoiceData,
                {
                    headers,
                    params: { organization_id: this.orgId },
                }
            );

            return response.data.invoice.invoice_id;
        } catch (error: any) {
            console.error('Books invoice creation failed:', error.response?.data || error.message);
            throw error;
        }
    }

    // ==================== DESK OPERATIONS ====================

    /**
     * Create support ticket in Zoho Desk
     */
    async createTicket(ticket: TicketData): Promise<string> {
        const headers = await this.getAuthHeaders();

        const ticketData = {
            subject: ticket.subject,
            description: ticket.description,
            email: ticket.email,
            contactId: ticket.contactId,
            category: ticket.category || 'General',
            priority: ticket.priority || 'Medium',
            channel: 'Web',
            departmentId: process.env.ZOHO_DESK_DEPARTMENT_ID,
        };

        try {
            const response = await this.axiosInstance.post(
                `${ZOHO_DESK_URL}/tickets`,
                ticketData,
                {
                    headers: {
                        ...headers,
                        orgId: this.orgId,
                    },
                }
            );

            return response.data.id;
        } catch (error: any) {
            console.error('Desk ticket creation failed:', error.response?.data || error.message);
            throw error;
        }
    }

    // ==================== ORDER FLOW ORCHESTRATION ====================

    /**
     * Process a complete order - creates contact, deal, and invoice
     */
    async processOrder(order: OrderData, customer: CustomerData): Promise<{
        contactId: string;
        dealId: string;
        invoiceId: string;
    }> {
        if (!this.isConfigured()) {
            console.warn('Zoho integration not configured, skipping sync');
            return { contactId: '', dealId: '', invoiceId: '' };
        }

        try {
            // 1. Create/update CRM contact
            const contactId = await this.upsertContact(customer);
            console.log(`Zoho CRM Contact: ${contactId}`);

            // 2. Create CRM deal
            const dealId = await this.createDeal(order, contactId);
            console.log(`Zoho CRM Deal: ${dealId}`);

            // 3. Create Books customer and invoice
            const booksCustomerId = await this.upsertBooksCustomer(customer);
            const invoiceId = await this.createInvoice(order, booksCustomerId);
            console.log(`Zoho Books Invoice: ${invoiceId}`);

            return { contactId, dealId, invoiceId };
        } catch (error) {
            console.error('Zoho order processing failed:', error);
            // Don't throw - order should still succeed even if Zoho sync fails
            return { contactId: '', dealId: '', invoiceId: '' };
        }
    }
}

// Export singleton instance
export const zohoClient = new ZohoClient();
export type { CustomerData, OrderData, TicketData };
