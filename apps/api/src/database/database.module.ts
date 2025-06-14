import { Global, Module } from '@nestjs/common';
import { db } from '@workspace/database';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
@Global() // To use everywhere
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useValue: db,
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
