/**
 * Bluewud API - Zoho Catalyst Function
 * Handles order processing and Zoho CRM/Books integration
 */

const axios = require('axios');
const config = require('./config');

// Zoho endpoints (from config)
const ZOHO_ACCOUNTS_URL = config.ZOHO_ACCOUNTS_URL;
const ZOHO_CRM_URL = config.ZOHO_CRM_URL;

// Token cache
let accessToken = null;
let tokenExpiry = 0;

// Refresh Zoho access token
async function refreshAccessToken() {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const response = await axios.post(
        `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
        null,
        {
            params: {
                refresh_token: config.ZOHO_REFRESH_TOKEN,
                client_id: config.ZOHO_CLIENT_ID,
                client_secret: config.ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token',
            },
        }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (55 * 60 * 1000);
    return accessToken;
}

// Create CRM contact
async function createContact(customer) {
    const token = await refreshAccessToken();

    const contactData = {
        data: [{
            First_Name: customer.firstName,
            Last_Name: customer.lastName,
            Email: customer.email,
            Phone: customer.phone,
            Lead_Source: 'Website - Catalyst',
        }],
        duplicate_check_fields: ['Email'],
    };

    const response = await axios.post(
        `${ZOHO_CRM_URL}/Contacts/upsert`,
        contactData,
        { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );

    return response.data.data?.[0]?.details?.id;
}

// Create CRM deal
async function createDeal(order, contactId) {
    const token = await refreshAccessToken();

    const dealData = {
        data: [{
            Deal_Name: `Order #${order.orderId}`,
            Amount: order.total,
            Stage: 'New Order',
            Closing_Date: new Date().toISOString().split('T')[0],
            Contact_Name: contactId,
        }],
    };

    const response = await axios.post(
        `${ZOHO_CRM_URL}/Deals`,
        dealData,
        { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );

    return response.data.data?.[0]?.details?.id;
}

// Main handler
module.exports = async (catalyst, context) => {
    const request = context.request;
    const response = context.response;

    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).send('OK');
    }

    const path = request.path || '/';
    const body = request.body || {};

    try {
        // Route: Health check
        if (path === '/health' || path === '/') {
            return response.status(200).json({
                status: 'ok',
                service: 'Bluewud API (Catalyst)',
                timestamp: new Date().toISOString(),
            });
        }

        // Route: Process order
        if (path === '/order' && request.method === 'POST') {
            const { customer, order } = body;

            if (!customer || !order) {
                return response.status(400).json({ error: 'Missing customer or order data' });
            }

            // Create CRM contact
            const contactId = await createContact(customer);
            console.log('CRM Contact created:', contactId);

            // Create CRM deal
            const dealId = await createDeal(order, contactId);
            console.log('CRM Deal created:', dealId);

            return response.status(200).json({
                success: true,
                contactId,
                dealId,
                message: 'Order synced to Zoho CRM',
            });
        }

        // Route: Test token
        if (path === '/test-token') {
            const token = await refreshAccessToken();
            return response.status(200).json({
                success: true,
                tokenPreview: token.substring(0, 20) + '...',
            });
        }

        // 404 for unknown routes
        return response.status(404).json({ error: 'Route not found' });

    } catch (error) {
        console.error('API Error:', error.message);
        return response.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
};
