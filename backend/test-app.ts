import app from './src/app';
import { config } from './src/config/env';

console.log('Testing Express app import...');
console.log('Port config:', config.port);

// Just test importing and basic accessibility
console.log('App object available:', !!app);
console.log('App routes count:', app._router.stack.length);

console.log('Express app appears to be working!');