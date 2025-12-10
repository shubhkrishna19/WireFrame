"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Simplified test server to debug startup issues
const env_1 = require("./src/config/env");
const database_1 = require("./src/config/database");
async function testServerStartup() {
    console.log('Starting server initialization test...');
    console.log('Environment loaded successfully');
    console.log('Port will be:', env_1.config.port);
    try {
        console.log('Checking database connection...');
        const isConnected = await (0, database_1.checkConnection)();
        console.log('Database connection check result:', isConnected);
    }
    catch (error) {
        console.error('Database connection error:', error);
        return;
    }
    console.log('Server initialization appears to be working!');
}
testServerStartup().then(() => {
    console.log('Test completed successfully');
}).catch(err => {
    console.error('Test failed:', err);
});
