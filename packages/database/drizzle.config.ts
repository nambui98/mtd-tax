import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from root
config({ path: path.resolve(__dirname, '../../../.env.local') });
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, './.env.local') });

export default defineConfig({
    out:'./drizzle',
    schema: './src/schema/index.ts',
    dialect: "postgresql",
    dbCredentials:{
        url: process.env.DATABASE_URL!,
        // url:"postgresql://postgres:postgres@localhost:5432/mtdtax"
    },
    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },
    strict: true,
    verbose: true,
});
