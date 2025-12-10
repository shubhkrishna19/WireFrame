import { execSync } from 'child_process';
import { chdir } from 'process';

try {
  // Change to backend directory
  chdir('backend');

  console.log('🚀 Starting Mulary Backend Server...');
  console.log('📍 Working directory:', process.cwd());

  // Try to run the server directly
  execSync('node node_modules/.bin/ts-node src/server.ts', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}
