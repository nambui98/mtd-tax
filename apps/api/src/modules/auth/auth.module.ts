import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>(
                        'JWT_EXPIRES_IN',
                        '1d',
                    ),
                },
            }),
            inject: [ConfigService],
        }),

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const mailUser = configService.get<string>('MAIL_USER');
                const mailPassword = configService.get<string>('MAIL_PASSWORD');
                const mailFrom = configService.get<string>('MAIL_FROM_ADDRESS');

                if (!mailUser || !mailPassword || !mailFrom) {
                    console.warn(
                        'Mail configuration is incomplete. Email functionality may not work properly.',
                    );
                    return {
                        transport: {
                            host: 'localhost',
                            port: 1025,
                            ignoreTLS: true,
                        },
                        defaults: {
                            from: 'noreply@example.com',
                        },
                    };
                }

                return {
                    transport: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: mailUser,
                            pass: mailPassword,
                        },
                    },
                    defaults: {
                        from: `"No Reply" <${mailFrom}>`,
                    },
                    template: {
                        dir: join(
                            __dirname,
                            '..',
                            '..',
                            '..',
                            'src',
                            'modules',
                            'auth',
                            'templates',
                        ),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: false,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
