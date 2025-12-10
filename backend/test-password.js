const bcrypt = require('bcryptjs');

// Test password hashing and comparison
const testPassword = 'admin123';
const storedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Y9t.yBsH7uVe';

console.log('🔍 Testing password verification...');
console.log('Test password:', testPassword);
console.log('Stored hash:', storedHash);

bcrypt.compare(testPassword, storedHash, (err, result) => {
  if (err) {
    console.error('❌ Error comparing passwords:', err);
  } else {
    console.log('✅ Password comparison result:', result);
    if (result) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does not match!');
    }
  }
});

// Also test hashing a new password
console.log('\n🔍 Testing password hashing...');
bcrypt.hash('admin123', 12, (err, hash) => {
  if (err) {
    console.error('❌ Error hashing password:', err);
  } else {
    console.log('✅ New hash for admin123:', hash);
    console.log('Length:', hash.length);
  }
});
