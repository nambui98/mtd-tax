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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../../.env',
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
        UsersModule,
        DatabaseModule,
        AuthModule,
        CompaniesModule,
        RolesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
