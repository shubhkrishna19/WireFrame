// Simple script to create database schema
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'src', 'db', 'schema.sql');

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('🔄 Creating database schema...');

try {
  // Read and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Split by semicolon and execute each statement
  const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

  for (const statement of statements) {
    if (statement.trim()) {
      db.exec(statement.trim() + ';');
    }
  }

  console.log('✅ Database schema created successfully!');

  // Verify tables were created
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 Created tables:', tables.map(t => t.name).join(', '));

} catch (error) {
  console.error('❌ Error creating schema:', error);
} finally {
  db.close();
}
