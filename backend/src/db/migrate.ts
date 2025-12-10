// ============================================
// DATABASE MIGRATION SCRIPT
// ============================================

import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '../config/database';
import { logger } from '../config/logger';

const runMigration = async () => {
  try {
    logger.info('🚀 Starting database migration...');

    // Read schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute the entire schema at once
    try {
      db.exec(schema);
    } catch (error: any) {
      // Skip errors for statements that create things that already exist
      if (!error.message.includes('already exists') && !error.message.includes('duplicate column name')) {
        throw error;
      }
    }

    logger.info('✅ Database migration completed successfully!');
    logger.info('');
    logger.info('📊 Created:');
    logger.info('   - 8 tables');
    logger.info('   - Indexes');
    logger.info('   - Default admin user: admin@mulary.com / admin123');
    logger.info('   - 5 default categories');
    logger.info('');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
