"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const env_1 = require("./src/config/env");
console.log('Testing Express app import...');
console.log('Port config:', env_1.config.port);
// Just test importing and basic accessibility
console.log('App object available:', !!app_1.default);
console.log('App routes count:', app_1.default._router.stack.length);
console.log('Express app appears to be working!');
