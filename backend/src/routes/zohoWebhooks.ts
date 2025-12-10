/**
 * Zoho Webhook Handler
 * Processes incoming webhooks from Zoho services
 */

import { Router, Request, Response } from 'express';
import { zohoClient } from '../services/zohoClient';

const router = Router();

interface ZohoWebhookPayload {
    module: string;
    operation: string;
    data: Record<string, any>;
}

/**
 * Verify Zoho webhook signature (if configured)
 */
const verifyWebhookSignature = (req: Request): boolean => {
    const signature = req.headers['x-zoho-signature'];
    const webhookSecret = process.env.ZOHO_WEBHOOK_SECRET;

    // Skip verification if no secret configured
    if (!webhookSecret) {
        console.warn('Zoho webhook secret not configured - skipping verification');
        return true;
    }

    // TODO: Implement HMAC verification
    // const expectedSignature = crypto.createHmac('sha256', webhookSecret)
    //   .update(JSON.stringify(req.body))
    //   .digest('hex');

    return true;
};

/**
 * Handle CRM webhooks (deal updates, contact changes)
 */
router.post('/crm', async (req: Request, res: Response) => {
    try {
        if (!verifyWebhookSignature(req)) {
            res.status(401).json({ error: 'Invalid webhook signature' });
            return;
        }

        const payload: ZohoWebhookPayload = req.body;
        console.log(`Zoho CRM webhook received: ${payload.module}/${payload.operation}`);

        switch (payload.module) {
            case 'Deals':
                await handleDealUpdate(payload);
                break;
            case 'Contacts':
                await handleContactUpdate(payload);
                break;
            default:
                console.log(`Unhandled CRM module: ${payload.module}`);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('CRM webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Handle Books webhooks (invoice payments, status changes)
 */
router.post('/books', async (req: Request, res: Response) => {
    try {
        if (!verifyWebhookSignature(req)) {
            res.status(401).json({ error: 'Invalid webhook signature' });
            return;
        }

        const payload = req.body;
        console.log(`Zoho Books webhook received:`, payload.event_type);

        switch (payload.event_type) {
            case 'invoice.paid':
                await handleInvoicePaid(payload);
                break;
            case 'invoice.overdue':
                await handleInvoiceOverdue(payload);
                break;
            default:
                console.log(`Unhandled Books event: ${payload.event_type}`);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('Books webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Handle Desk webhooks (ticket updates)
 */
router.post('/desk', async (req: Request, res: Response) => {
    try {
        if (!verifyWebhookSignature(req)) {
            res.status(401).json({ error: 'Invalid webhook signature' });
            return;
        }

        const payload = req.body;
        console.log(`Zoho Desk webhook received:`, payload.event);

        // Handle ticket events (status change, resolution, etc.)
        res.json({ success: true });
    } catch (error: any) {
        console.error('Desk webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== WEBHOOK HANDLERS ====================

async function handleDealUpdate(payload: ZohoWebhookPayload) {
    const deal = payload.data;
    const stage = deal.Stage;
    const orderId = deal.Order_ID;

    console.log(`Deal ${orderId} stage updated to: ${stage}`);

    // TODO: Update local order status based on CRM deal stage
    // Example: if (stage === 'Shipped') { updateOrderStatus(orderId, 'shipped'); }
}

async function handleContactUpdate(payload: ZohoWebhookPayload) {
    const contact = payload.data;
    console.log(`Contact updated: ${contact.Email}`);

    // TODO: Sync contact updates back to local database if needed
}

async function handleInvoicePaid(payload: any) {
    const invoice = payload.invoice;
    const orderId = invoice.reference_number;

    console.log(`Invoice paid for order: ${orderId}`);

    // Update CRM deal stage to "Payment Received"
    // TODO: Look up deal by Order_ID and update stage
    // await zohoClient.updateDealStage(dealId, 'Payment Received');
}

async function handleInvoiceOverdue(payload: any) {
    const invoice = payload.invoice;
    const orderId = invoice.reference_number;

    console.log(`Invoice overdue for order: ${orderId}`);

    // TODO: Create follow-up task or send reminder
}

export default router;
