import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from root
config({ path: path.resolve(__dirname, '../../../../.env') });
config({ path: path.resolve(__dirname, '../../../.env') });
config({ path: path.resolve(__dirname, '../../.env') });
config({ path: path.resolve(__dirname, '../.env') });
config({ path: path.resolve(__dirname, './.env') });

const DATABASE_URL = process.env.DATABASE_URL!;

if (!process.env.DATABASE_URL) {
    console.warn(
        'Warning: DATABASE_URL not found in environment variables, using default URL',
    );
}

export default defineConfig({
    out: './drizzle',
    schema: './src/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: DATABASE_URL,
    },
    migrations: {
        prefix: 'timestamp',
        table: '__drizzle_migrations__',
        schema: 'public',
    },
    strict: true,
    verbose: true,
});
