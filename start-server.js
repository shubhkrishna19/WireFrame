import { spawn } from 'child_process';
import { join } from 'path';

console.log('Starting Mulary Backend Server...');

const child = spawn('node', ['backend/node_modules/.bin/ts-node', 'backend/src/server.ts'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
});

child.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});
