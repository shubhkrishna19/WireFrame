// Simplified test server to debug startup issues
import { config } from './src/config/env';
import { checkConnection } from './src/config/database';

async function testServerStartup() {
  console.log('Starting server initialization test...');
  console.log('Environment loaded successfully');
  console.log('Port will be:', config.port);

  try {
    console.log('Checking database connection...');
    const isConnected = await checkConnection();
    console.log('Database connection check result:', isConnected);
  } catch (error) {
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