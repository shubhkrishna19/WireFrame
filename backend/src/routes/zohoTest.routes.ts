/**
 * Zoho Test Routes
 * Endpoints to test Zoho integration and create demo data
 */

import express, { Router, Request, Response } from 'express';
import { zohoClient } from '../services/zohoClient';

const router: Router = express.Router();

/**
 * GET /api/zoho/health
 * Check if Zoho credentials are configured
 */
router.get('/health', (req: Request, res: Response) => {
    const configured = zohoClient.isConfigured();
    res.json({
        status: configured ? 'configured' : 'not_configured',
        service: 'Zoho Integration',
        timestamp: new Date().toISOString(),
        message: configured
            ? 'Zoho credentials are configured. Use /api/zoho/test-token to verify OAuth.'
            : 'Missing Zoho credentials. Check ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN in .env',
    });
});

/**
 * GET /api/zoho/test-token
 * Test OAuth token refresh
 */
router.get('/test-token', async (req: Request, res: Response) => {
    try {
        if (!zohoClient.isConfigured()) {
            res.status(400).json({
                success: false,
                error: 'Zoho credentials not configured',
            });
            return;
        }

        const token = await zohoClient.refreshAccessToken();
        res.json({
            success: true,
            tokenPreview: token ? token.substring(0, 25) + '...' : 'null',
            message: 'OAuth token refresh successful!',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Check your ZOHO_REFRESH_TOKEN - it may have expired',
        });
    }
});

/**
 * POST /api/zoho/create-demo-contact
 * Create a demo contact in Zoho CRM
 */
router.post('/create-demo-contact', async (req: Request, res: Response) => {
    try {
        if (!zohoClient.isConfigured()) {
            res.status(400).json({
                success: false,
                error: 'Zoho credentials not configured',
            });
            return;
        }

        // Create a demo contact
        const demoCustomer = {
            firstName: 'Demo',
            lastName: 'Customer_' + Date.now(),
            email: `demo.customer.${Date.now()}@bluewud.com`,
            phone: '9999999999',
        };

        const contactId = await zohoClient.upsertContact(demoCustomer);

        res.json({
            success: true,
            contactId,
            customer: demoCustomer,
            message: 'Demo contact created in Zoho CRM! Check your CRM Contacts module.',
            crmUrl: 'https://crm.zoho.com/crm/tab/Contacts',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/zoho/create-demo-deal
 * Create a demo deal (order) in Zoho CRM
 */
router.post('/create-demo-deal', async (req: Request, res: Response) => {
    try {
        if (!zohoClient.isConfigured()) {
            res.status(400).json({
                success: false,
                error: 'Zoho credentials not configured',
            });
            return;
        }

        // First create a contact
        const demoCustomer = {
            firstName: 'Bluewud',
            lastName: 'TestOrder_' + Date.now(),
            email: `order.test.${Date.now()}@bluewud.com`,
            phone: '8888888888',
        };

        const contactId = await zohoClient.upsertContact(demoCustomer);

        // Then create a deal
        const demoOrder = {
            orderId: 'DEMO-' + Date.now(),
            customerEmail: demoCustomer.email,
            contactId: contactId,
            total: 15999,
            subtotal: 14999,
            tax: 500,
            shipping: 500,
            items: [
                {
                    productId: 'PROD-001',
                    name: 'Rivodz King Size Bed',
                    sku: 'FU-BED-001',
                    quantity: 1,
                    price: 14999
                }
            ],
            shippingAddress: {
                street: '123 Furniture Lane',
                city: 'Bangalore',
                state: 'Karnataka',
                zipCode: '560001',
                country: 'India'
            }
        };

        const dealId = await zohoClient.createDeal(demoOrder, contactId);

        res.json({
            success: true,
            contactId,
            dealId,
            customer: demoCustomer,
            order: demoOrder,
            message: 'Demo contact and deal created in Zoho CRM!',
            crmUrls: {
                contacts: 'https://crm.zoho.com/crm/tab/Contacts',
                deals: 'https://crm.zoho.com/crm/tab/Deals',
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/zoho/endpoints
 * List all available Zoho test endpoints
 */
router.get('/endpoints', (req: Request, res: Response) => {
    res.json({
        endpoints: [
            { method: 'GET', path: '/api/zoho/health', description: 'Check Zoho configuration status' },
            { method: 'GET', path: '/api/zoho/test-token', description: 'Test OAuth token refresh' },
            { method: 'POST', path: '/api/zoho/create-demo-contact', description: 'Create a demo contact in Zoho CRM' },
            { method: 'POST', path: '/api/zoho/create-demo-deal', description: 'Create demo contact + deal in Zoho CRM' },
        ],
        documentation: 'See ZOHO_REFERENCE.md for full API reference',
    });
});

export default router;
