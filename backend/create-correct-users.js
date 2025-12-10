const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

// Users to create
const users = [
  { email: 'customer@test.com', password: 'customer123', name: 'Test Customer', role: 'customer' },
  { email: 'admin@test.com', password: 'admin123', name: 'Test Admin', role: 'admin' },
  { email: 'editor@test.com', password: 'editor123', name: 'Test Editor', role: 'editor' }
];

console.log('🔧 Creating correct test users...');

const createUsers = async () => {
  // Database is in the root directory, not backend directory
  const dbPath = path.join(__dirname, '..', 'mulary.db');
  const db = new Database(dbPath);

  try {
    // First, delete existing users
    db.prepare('DELETE FROM users').run();
    console.log('✅ Cleared existing users');

    // Create new users
    const insertStmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    for (const user of users) {
      // Generate UUID-like ID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Hash password
      const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 12, (err, hash) => {
          if (err) reject(err);
          else resolve(hash);
        });
      });

      // Insert user
      insertStmt.run(userId, user.email, hash, user.name, user.role);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    console.log('\n🎉 Users created successfully!');
    console.log('Login credentials:');
    users.forEach(user => {
      console.log(`  ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  }

  db.close();
};

createUsers();
