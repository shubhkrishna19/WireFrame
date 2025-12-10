/**
 * Bluewud API - Zoho Catalyst BasicIO Function
 * Using correct Catalyst BasicIO API: write(), setStatus(), getArgument()
 */

module.exports = async (basicio, context) => {
    try {
        // Get URL argument if passed
        const path = basicio.getArgument('path') || '';
        const action = basicio.getArgument('action') || 'health';

        // Prepare response
        const response = {
            status: 'ok',
            service: 'Bluewud API (Catalyst)',
            timestamp: new Date().toISOString(),
            path: path,
            action: action,
            endpoints: [
                'path=health - Health check',
                'path=test-token - Test OAuth',
                'action=order - Create CRM contact/deal'
            ]
        };

        // Set status and write response
        basicio.setStatus(200);
        basicio.write(JSON.stringify(response));

        // Close the context
        context.close();

    } catch (error) {
        console.error('Error:', error.message);
        basicio.setStatus(500);
        basicio.write(JSON.stringify({ error: error.message }));
        context.close();
    }
};
