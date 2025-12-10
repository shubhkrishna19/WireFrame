/**
 * Migration: Add Guest Order Support
 * Adds fields to support guest checkout without requiring user authentication
 */

import { query } from '../../config/database';
import { logger } from '../../config/logger';

export const migrateGuestOrderSupport = async (): Promise<void> => {
    try {
        logger.info('Starting guest order support migration...');

        // Check if columns already exist
        const tableInfo = await query("PRAGMA table_info(orders)");
        const columnNames = tableInfo.rows.map((col: any) => col.name);

        const migrations: string[] = [];

        // Add guest_email column if it doesn't exist
        if (!columnNames.includes('guest_email')) {
            migrations.push(`ALTER TABLE orders ADD COLUMN guest_email VARCHAR(255)`);
        }

        // Add guest_session_id column if it doesn't exist
        if (!columnNames.includes('guest_session_id')) {
            migrations.push(`ALTER TABLE orders ADD COLUMN guest_session_id VARCHAR(255)`);
        }

        // Execute migrations
        if (migrations.length > 0) {
            for (const migration of migrations) {
                logger.info(`Executing: ${migration}`);
                await query(migration);
            }

            // Create indexes for guest orders
            try {
                await query('CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email)');
                await query('CREATE INDEX IF NOT EXISTS idx_orders_guest_session ON orders(guest_session_id)');
                logger.info('Created indexes for guest orders');
            } catch (error) {
                logger.warn('Indexes may already exist:', error);
            }

            logger.info('Guest order support migration completed successfully');
        } else {
            logger.info('Guest order columns already exist, skipping migration');
        }
    } catch (error) {
        logger.error('Guest order support migration failed:', error);
        throw error;
    }
};

// Run migration if this file is executed directly
if (require.main === module) {
    migrateGuestOrderSupport();
    process.exit(0);
}
