
import { db, query } from './config/database';
import { logger } from './config/logger';

console.log('Starting DB Debug...');

async function test() {
    try {
        console.log('Running query...');
        const res = await query('SELECT 1 as val');
        console.log('Query result:', res);
        console.log('DB Debug Success');
    } catch (err) {
        console.error('DB Debug Failed:', err);
    }
}

test();
