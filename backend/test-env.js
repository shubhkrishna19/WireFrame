// Simple test to see if env config loads
try {
    console.log('Loading env config...');
    const { config } = require('./src/config/env');
    console.log('✅ Env config loaded successfully');
    console.log('Port:', config.port);
    console.log('Node Env:', config.nodeEnv);
} catch (error) {
    console.error('❌ Error loading env config:', error.message);
    console.error(error.stack);
    process.exit(1);
}
