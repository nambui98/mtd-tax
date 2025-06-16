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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { HmrcModule } from './modules/hmrc/hmrc.module';

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
        HmrcModule,
        RolesModule,
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: process.env.MAIL_FROM,
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
