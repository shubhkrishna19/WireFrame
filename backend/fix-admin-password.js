const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

// Generate correct hash for admin123
const correctPassword = 'admin123';

console.log('🔧 Fixing admin password...');

bcrypt.hash(correctPassword, 12, async (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    return;
  }

  console.log('✅ Generated hash for admin123:', hash);

  // Update database
  const dbPath = path.join(__dirname, 'mulary.db');
  const db = new Database(dbPath);

  try {
    const result = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(hash, 'admin@mulary.com');
    console.log('✅ Database updated:', result.changes, 'row(s) affected');

    // Verify the update
    const user = db.prepare('SELECT password_hash FROM users WHERE email = ?').get('admin@mulary.com');
    console.log('✅ New hash in database:', user.password_hash);

    // Test the password
    bcrypt.compare(correctPassword, user.password_hash, (err, result) => {
      if (err) {
        console.error('❌ Error testing password:', err);
      } else {
        console.log('✅ Password verification test:', result ? 'SUCCESS' : 'FAILED');
      }
    });

  } catch (error) {
    console.error('❌ Database error:', error.message);
  }

  db.close();
});
