const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'mulary.db');
console.log('Opening database at:', dbPath);
const db = new Database(dbPath);

try {
    console.log('Starting migration...');

    // Check if columns exist
    const tableInfo = db.prepare("PRAGMA table_info(orders)").all();
    const columnNames = tableInfo.map(col => col.name);

    if (!columnNames.includes('guest_email')) {
        console.log('Adding guest_email column...');
        db.prepare("ALTER TABLE orders ADD COLUMN guest_email VARCHAR(255)").run();
    } else {
        console.log('guest_email column already exists.');
    }

    if (!columnNames.includes('guest_session_id')) {
        console.log('Adding guest_session_id column...');
        db.prepare("ALTER TABLE orders ADD COLUMN guest_session_id VARCHAR(255)").run();
    } else {
        console.log('guest_session_id column already exists.');
    }

    // Make user_id nullable if it isn't already (SQLite doesn't support ALTER COLUMN easily, 
    // but we can just ensure our code handles nulls. The schema definition usually doesn't enforce NOT NULL unless specified.
    // Let's check if it is NOT NULL.
    const userIdCol = tableInfo.find(col => col.name === 'user_id');
    if (userIdCol && userIdCol.notnull === 1) {
        console.log('WARNING: user_id is NOT NULL. SQLite does not support dropping NOT NULL constraints easily without recreating the table.');
        console.log('We will proceed, but guest orders might fail if we insert NULL. We might need to use a placeholder or recreate the table.');
        // For MVP/Dev, recreating is risky if we have data. 
        // Strategy: We will use a placeholder string like "GUEST" for user_id if we can't make it null, 
        // OR we just accept that for this migration we might need to do the full table recreate dance if strictly needed.
        // However, let's first try to see if we can just insert with user_id as NULL in the service.
        // If the original schema was created without NOT NULL, we are good.
    }

    console.log('Migration completed.');
} catch (error) {
    console.error('Migration failed:', error);
}
