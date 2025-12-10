const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'mulary.db');
const db = new Database(dbPath);

console.log('🔍 Checking database contents...');

// Check if users table exists and has data
try {
  const users = db.prepare('SELECT id, email, name, role, is_active FROM users').all();
  console.log('👥 Users in database:', users.length);
  users.forEach(user => {
    console.log(`  - ${user.email} (${user.role}) - Active: ${user.is_active}`);
  });

  // Check admin user specifically
  const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@mulary.com');
  if (adminUser) {
    console.log('✅ Admin user found:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password hash: ${adminUser.password_hash}`);
    console.log(`  Role: ${adminUser.role}`);
    console.log(`  Active: ${adminUser.is_active}`);
  } else {
    console.log('❌ Admin user not found!');
  }

} catch (error) {
  console.error('❌ Database error:', error.message);
}

db.close();
