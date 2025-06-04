import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './src/client';

async function main() {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './src/migrations' });
    console.log('Migrations completed!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});