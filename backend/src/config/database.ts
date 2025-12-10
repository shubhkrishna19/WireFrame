// ============================================
// DATABASE CONNECTION (SQLite for Development)
// ============================================

import sqlite3 from 'sqlite3';
import path from 'path';
import { config } from './env';
import { logger } from './logger';

// Enable verbose mode for debugging
const sqlite = sqlite3.verbose();

// Create database connection
const dbPath = path.join(process.cwd(), 'mulary.db');
export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    logger.error('❌ Error opening database:', err.message);
  } else {
    logger.info('✅ Connected to SQLite database');
    // Enable WAL mode for better performance
    db.run('PRAGMA journal_mode = WAL');
  }
});

// Create custom query function that mimics pg query interface with generic types
export const query = async <T = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number }> => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const isSelect = text.trim().toUpperCase().startsWith('SELECT') || text.trim().toUpperCase().startsWith('PRAGMA');

    if (isSelect) {
      db.all(text, params, (err, rows) => {
        const duration = Date.now() - start;
        if (err) {
          logger.error('Database query error:', { text, error: err });
          reject(err);
          return;
        }

        if (config.debug) {
          logger.debug('Executed query', {
            text,
            duration: `${duration}ms`,
            rows: rows ? rows.length : 0,
          });
        }

        resolve({
          rows: (rows as T[]) || [],
          rowCount: rows ? rows.length : 0,
        });
      });
    } else {
      db.run(text, params, function (err) {
        const duration = Date.now() - start;
        if (err) {
          logger.error('Database query error:', { text, error: err });
          reject(err);
          return;
        }

        if (config.debug) {
          logger.debug('Executed query', {
            text,
            duration: `${duration}ms`,
            rows: this.changes,
          });
        }

        resolve({
          rows: [],
          rowCount: this.changes,
        });
      });
    }
  });
};

// Transaction helper with query support
export const transaction = async <T>(
  callback: (client: { query: typeof query }) => Promise<T>
): Promise<T> => {
  // SQLite3 doesn't support nested transactions easily, so we'll wrap in a simple BEGIN/COMMIT
  // Note: This is a simplified transaction wrapper
  const client = { query };

  try {
    await query('BEGIN TRANSACTION');
    const result = await callback(client);
    await query('COMMIT');
    return result;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

// Check database connection
export const checkConnection = async (): Promise<boolean> => {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database connection check failed:', error);
    return false;
  }
};

// Close database connection
export const closeConnections = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        logger.error('Error closing database connections:', err);
        reject(err);
      } else {
        logger.info('Database connections closed');
        resolve();
      }
    });
  });
};

// Utility: Check if table exists
export const tableExists = async (tableName: string): Promise<boolean> => {
  const result = await query(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  );
  return result.rows.length > 0;
};

// Utility: Get table row count
export const getRowCount = async (tableName: string): Promise<number> => {
  const result = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
  return (result.rows[0] as any).count;
};

// Export db for direct access if needed
export default db;
