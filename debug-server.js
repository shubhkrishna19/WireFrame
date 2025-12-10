import { spawn } from 'child_process';
import { join } from 'path';

console.log('Starting backend server in debug mode...');

const tsNodePath = join(process.cwd(), 'backend', 'node_modules', '.bin', 'ts-node');

const child = spawn('node', [tsNodePath, '--transpile-only', 'backend/src/server.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
});

child.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});
