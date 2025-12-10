const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(process.cwd(), 'mulary.db');
const db = new Database(dbPath);

console.log('🔍 Testing database query...');

// Test the exact query used in login
try {
  const email = 'admin@test.com';
  const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1');
  const result = stmt.all(email);

  console.log('Query:', 'SELECT * FROM users WHERE email = ? AND is_active = 1');
  console.log('Parameter:', email);
  console.log('Results found:', result.length);

  if (result.length > 0) {
    console.log('✅ User found:', result[0].email);
    console.log('Password hash:', result[0].password_hash);
  } else {
    console.log('❌ No user found');

    // Check all users
    console.log('\n📋 All users in database:');
    const allUsers = db.prepare('SELECT email, role, is_active FROM users').all();
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Active: ${user.is_active}`);
    });
  }

} catch (error) {
  console.error('❌ Query error:', error.message);
}

db.close();
