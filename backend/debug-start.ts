#!/usr/bin/env ts-node

// Debug script to test server startup
console.log('🔍 Testing server startup...');

// Test environment loading
try {
  const config = require('./src/config/env').config;
  console.log('✅ Environment loaded successfully');
  console.log('📍 Port:', config.port);
  console.log('🌐 API URL:', config.apiUrl);
  console.log('🔐 JWT Secret length:', config.jwt.secret.length);
} catch (error: any) {
  console.error('❌ Environment loading failed:', error.message);
  process.exit(1);
}

// Test database connection
try {
  const db = require('./src/config/database').db;
  console.log('✅ Database connection successful');
} catch (error: any) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Start server
try {
  console.log('🚀 Starting server...');
  require('./src/server');
} catch (error: any) {
  console.error('❌ Server startup failed:', error.message);
  process.exit(1);
}
