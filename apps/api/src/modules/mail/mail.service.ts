import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: any, token: string) {
        const url = `${process.env.FRONTEND_URL}/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome! Confirm your Email',
            template: 'confirmation',
            context: {
                name: user.firstName,
                url,
                token,
            },
        });
    }

    async sendPasswordReset(user: any, token: string) {
        const url = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            template: 'reset-password',
            context: {
                name: user.firstName,
                url,
                token,
            },
        });
    }

    async sendWelcomeEmail(user: any) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Our Platform!',
            template: 'welcome',
            context: {
                name: user.firstName,
                email: user.email,
            },
        });
    }
}
