/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Injectable,
    Inject,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
    InsertCompany,
    InsertUser,
    usersTable,
    companiesTable,
    InsertHMRC,
    rolesTable,
    userRolesTable,
} from '@workspace/database/dist/schema';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: Database,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailerService: MailerService,
    ) {}

    async signup(signupDto: { user: InsertUser; company?: InsertCompany }) {
        // Check if user exists
        const existingUser = await this.findUserByEmail(signupDto.user.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(signupDto.user.password, 10);

        // Generate OTP secret
        const secret = speakeasy.generateSecret({
            name: `MTD Tax:${signupDto.user.email}`,
        });

        // Start transaction
        return await this.db.transaction(async (tx) => {
            // Create user
            const [user] = await tx
                .insert(usersTable)
                .values({
                    email: signupDto.user.email,
                    firstName: signupDto.user.firstName,
                    lastName: signupDto.user.lastName,
                    passwordHash: hashedPassword,
                    otpSecret: secret.base32,
                    phoneNumber: signupDto.user.phoneNumber,
                    jobTitle: signupDto.user.jobTitle,
                    practiceType: signupDto.user.practiceType as
                        | 'accountancy_practice'
                        | 'bookkeeping_service'
                        | 'tax_advisory_firm'
                        | null,
                })
                .returning();

            // Assign default user role
            const [defaultRole] = await tx
                .select()
                .from(rolesTable)
                .where(eq(rolesTable.name, 'user'))
                .limit(1);

            if (defaultRole) {
                await tx.insert(userRolesTable).values({
                    userId: user.id,
                    roleId: defaultRole.id,
                });
            }

            // Create company if provided
            if (signupDto.company) {
                await tx.insert(companiesTable).values({
                    ...signupDto.company,
                    ownerId: user.id,
                });
            }

            // Generate QR code
            // const qrCode = await QRCode.toDataURL(secret.otpauth_url as string);

            // Send welcome email with QR code
            // await this.mailerService.sendMail({
            //     to: signupDto.user.email,
            //     subject: 'Welcome to MTD Tax',
            //     template: 'welcome',
            //     context: {
            //         email: signupDto.user.email,
            //         qrCode,
            //     },
            // });

            return {
                message: 'User created successfully',
                // qrCode,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
        });
    }

    async login(email: string, password: string) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );
        console.log('====================================');
        console.log(isPasswordValid);
        console.log('====================================');
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Get user roles
        const userRoles = await this.db
            .select({
                roleName: rolesTable.name,
            })
            .from(userRolesTable)
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .where(eq(userRolesTable.userId, user.id));

        const payload = {
            sub: user.id,
            email: user.email,
            roles: userRoles.map((ur) => ur.roleName),
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                // expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
                expiresIn: '1h',
                // expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                // expiresIn: this.configService.get<string>(
                //     'JWT_REFRESH_EXPIRES_IN',
                // ),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 3600,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: userRoles.map((ur) => ur.roleName),
            },
        };
    }

    async verifyOTP(email: string, token: string) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const verified = speakeasy.totp.verify({
            secret: user.otpSecret as string,
            encoding: 'base32',
            token,
        });

        if (!verified) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // Get user roles
        const userRoles = await this.db
            .select({
                roleName: rolesTable.name,
            })
            .from(userRolesTable)
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .where(eq(userRolesTable.userId, user.id));

        const payload = {
            sub: user.id,
            email: user.email,
            roles: userRoles.map((ur) => ur.roleName),
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: userRoles.map((ur) => ur.roleName),
            },
        };
    }

    async forgotPassword(email: string) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Generate password reset token
        const resetToken = await this.jwtService.signAsync(
            { sub: user.id, email: user.email },
            {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            },
        );

        // Send password reset email
        await this.mailerService.sendMail({
            to: email,
            subject: 'Password Reset Request',
            template: 'password-reset',
            context: {
                resetToken,
                email,
            },
        });

        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this.db
                .update(usersTable)
                .set({ passwordHash: hashedPassword })
                .where(eq(usersTable.id, payload.sub));

            return { message: 'Password reset successfully' };
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.findUserByEmail(payload.email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Get user roles
            const userRoles = await this.db
                .select({
                    roleName: rolesTable.name,
                })
                .from(userRolesTable)
                .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
                .where(eq(userRolesTable.userId, user.id));

            const newPayload = {
                sub: user.id,
                email: user.email,
                roles: userRoles.map((ur) => ur.roleName),
            };

            const [accessToken, newRefreshToken] = await Promise.all([
                this.jwtService.signAsync(newPayload, {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: '1h',
                }),
                this.jwtService.signAsync(newPayload, {
                    secret: this.configService.get<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                    expiresIn: '7d',
                }),
            ]);

            return {
                access_token: accessToken,
                refresh_token: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    // Helper methods
    private async findUserByEmail(email: string) {
        const [user] = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            return null;
        }

        // Get user roles
        const userRoles = await this.db
            .select({
                roleName: rolesTable.name,
            })
            .from(userRolesTable)
            .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
            .where(eq(userRolesTable.userId, user.id));

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: userRoles.map((ur) => ur.roleName),
        };
    }

    async getProfile(user: { sub: number; email: string; roles: string[] }) {
        const userData = await this.findUserByEmail(user.email);
        if (!userData) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.sub,
            email: user.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            roles: user.roles,
        };
    }

    async hmrcHello() {
        const response = await axios.get(
            'https://test-api.service.hmrc.gov.uk/hello/world',
            {
                headers: {
                    // Authorization:async `Bearer ${this.configService.get<string>('HMRC_API_KEY')}`,
                    Accept: 'application/vnd.hmrc.1.0+xml',
                },
            },
        );
        return response.data;
    }
}
