import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { envSchema } from './config/env.schema';
import { RolesModule } from './modules/roles/roles.module';
import { HmrcModule } from './modules/hmrc/hmrc.module';
import { join } from 'path';
import { ClientsModule } from './modules/clients/clients.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                join(process.cwd(), 'apps/api/.env.local'),
                join(process.cwd(), '.env.local'),
                join(process.cwd(), '.env'),
            ],
            expandVariables: true,
            validate: (config) => {
                const result = envSchema.safeParse(config);
                if (!result.success) {
                    console.error(
                        '❌ Invalid environment variables:',
                        result.error.format(),
                    );
                    throw new Error('Invalid environment variables');
                }
                return result.data;
            },
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        CompaniesModule,
        HmrcModule,
        RolesModule,
        ClientsModule,
        DocumentsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
