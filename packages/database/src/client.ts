import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../../../.env.local') });
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, './.env.local') });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const connectionString = process.env.DATABASE_URL;

// Create a singleton instance for server-side usage
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
    if (!_db) {
        const pool = new Pool({
            connectionString,
            ssl:
                process.env.NODE_ENV === 'production'
                    ? { rejectUnauthorized: false }
                    : undefined,
            max: 10,
            idleTimeoutMillis: 20000,
            connectionTimeoutMillis: 10000,
        });
        _db = drizzle(pool, { schema });
    }
    return _db;
}

// Export a default instance for direct imports
export const db = getDb();
export type Database = typeof db;
