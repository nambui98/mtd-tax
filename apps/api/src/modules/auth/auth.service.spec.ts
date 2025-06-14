/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database.module';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

// Mock bcrypt
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

// Mock speakeasy
jest.mock('speakeasy', () => ({
    generateSecret: jest.fn().mockReturnValue({
        ascii: 'mock-secret',
        hex: 'mock-hex',
        base32: 'mock-base32',
        otpauth_url: 'mock-url',
    }),
    totp: {
        verify: jest.fn(),
    },
}));

describe('AuthService', () => {
    let service: AuthService;
    let mockJwtService: jest.Mocked<JwtService>;
    let mockConfigService: jest.Mocked<ConfigService>;
    let mockMailerService: jest.Mocked<MailerService>;
    let mockDb: any;

    beforeEach(async () => {
        mockJwtService = {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
        } as any;

        mockConfigService = {
            get: jest.fn(),
        } as any;

        mockMailerService = {
            sendMail: jest.fn(),
        } as any;

        mockDb = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            transaction: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: DATABASE_CONNECTION,
                    useValue: mockDb,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: MailerService,
                    useValue: mockMailerService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);

        // Reset mocks
        jest.clearAllMocks();
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);
        (speakeasy.generateSecret as jest.Mock).mockReturnValue({
            ascii: 'mock-secret',
            hex: 'mock-hex',
            base32: 'mock-base32',
            otpauth_url: 'mock-url',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        const mockSignupDto = {
            user: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
                confirmPassword: 'password123',
            },
            company: {
                name: 'Test Company',
                addressLine1: '123 Test St',
                city: 'Test City',
                postcode: '12345',
            },
        };

        it('should successfully register a new user', async () => {
            const mockUser = {
                id: 1,
                email: mockSignupDto.user.email,
                firstName: mockSignupDto.user.firstName,
                lastName: mockSignupDto.user.lastName,
            };

            const mockDefaultRole = {
                id: 1,
                name: 'user',
            };

            // Chainable mock for select().from().where()
            const selectChainNoUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainNoUser);

            // Mock transaction object (tx) to support tx.insert().values().returning()
            const mockTx = {
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockUser]),
                select: jest.fn().mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            limit: jest
                                .fn()
                                .mockResolvedValue([mockDefaultRole]),
                        }),
                    }),
                }),
            };
            mockDb.transaction.mockImplementationOnce(
                (callback: (tx: any) => Promise<any>) => callback(mockTx),
            );

            mockDb.insert.mockResolvedValueOnce([]); // User role assignment
            mockDb.insert.mockResolvedValueOnce([]); // Company creation
            mockMailerService.sendMail.mockResolvedValueOnce(undefined);

            const result = await service.signup(mockSignupDto);

            expect(result).toHaveProperty(
                'message',
                'User created successfully',
            );
            expect(result).toHaveProperty('user');
            expect(result.user).toEqual({
                id: mockUser.id,
                email: mockUser.email,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
            });
        });

        it('should throw BadRequestException when user already exists', async () => {
            const selectChainUserExists = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([{ id: 1 }]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUserExists);

            await expect(service.signup(mockSignupDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('login', () => {
        const mockLoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully login a user', async () => {
            const mockUser = {
                id: 1,
                email: mockLoginDto.email,
                passwordHash: 'hashed_password',
            };

            const mockUserRoles = [{ roleName: 'user' }];

            const selectChainUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([mockUser]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUser);

            const selectChainRoles = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockUserRoles),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainRoles);

            // Mock bcrypt.compare to return true
            (
                jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock
            ).mockResolvedValueOnce(true);

            mockJwtService.signAsync.mockResolvedValueOnce('access_token');
            mockJwtService.signAsync.mockResolvedValueOnce('refresh_token');

            const result = await service.login(
                mockLoginDto.email,
                mockLoginDto.password,
            );

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            const selectChainNoUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainNoUser);

            await expect(
                service.login(mockLoginDto.email, mockLoginDto.password),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('verifyOTP', () => {
        const mockVerifyOtpDto = {
            email: 'test@example.com',
            token: '123456',
        };

        it('should successfully verify OTP', async () => {
            const mockUser = {
                id: 1,
                email: mockVerifyOtpDto.email,
                otpSecret: 'mock_otp_secret',
            };

            const mockUserRoles = [{ roleName: 'user' }];

            const selectChainUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([mockUser]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUser);

            const selectChainRoles = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockUserRoles),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainRoles);

            // Mock speakeasy.totp.verify to return true
            (
                jest.spyOn(speakeasy.totp, 'verify') as unknown as jest.Mock
            ).mockReturnValueOnce(true);

            mockJwtService.signAsync.mockResolvedValueOnce('access_token');
            mockJwtService.signAsync.mockResolvedValueOnce('refresh_token');

            const result = await service.verifyOTP(
                mockVerifyOtpDto.email,
                mockVerifyOtpDto.token,
            );

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException for invalid OTP', async () => {
            const mockVerifyOtpDto = {
                email: 'test@example.com',
                otp: 'invalid_token',
            };

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                otpSecret: 'mock-secret',
            };

            const mockUserRoles = [{ roleName: 'user' }, { roleName: 'admin' }];

            // Mock database queries
            mockDb.select.mockReturnValue({
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([mockUser]),
            });

            mockDb.select.mockReturnValueOnce({
                from: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockUserRoles),
            });

            // Mock speakeasy to return false for invalid OTP
            (speakeasy.totp.verify as jest.Mock).mockReturnValueOnce(false);

            await expect(
                service.verifyOTP(mockVerifyOtpDto.email, mockVerifyOtpDto.otp),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('forgotPassword', () => {
        const mockEmail = 'test@example.com';

        it('should successfully send password reset email', async () => {
            const mockUser = {
                id: 1,
                email: mockEmail,
            };

            const selectChainUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([mockUser]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUser);

            mockJwtService.signAsync.mockResolvedValueOnce('reset_token');
            mockMailerService.sendMail.mockResolvedValueOnce(undefined);

            const result = await service.forgotPassword(mockEmail);

            expect(result).toHaveProperty(
                'message',
                'Password reset email sent',
            );
        });

        it('should throw UnauthorizedException when user not found', async () => {
            const selectChainNoUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainNoUser);

            await expect(service.forgotPassword(mockEmail)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('resetPassword', () => {
        it('should successfully reset password', async () => {
            const mockToken = 'valid_token';
            const mockNewPassword = 'new_password';
            const mockHashedPassword = 'hashed_password';
            const mockJwtSecret = 'test-jwt-secret';

            // Mock config service
            mockConfigService.get.mockImplementation((key: string) => {
                if (key === 'JWT_SECRET') return mockJwtSecret;
                return undefined;
            });

            // Mock JWT verification to return valid payload
            mockJwtService.verifyAsync.mockResolvedValueOnce({
                sub: 1,
                email: 'test@example.com',
            });

            // Mock bcrypt hash
            (bcrypt.hash as jest.Mock).mockResolvedValueOnce(
                mockHashedPassword,
            );

            // Mock database update
            mockDb.update.mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValueOnce([{ id: 1 }]),
            });

            const result = await service.resetPassword(
                mockToken,
                mockNewPassword,
            );

            expect(result).toEqual({ message: 'Password reset successfully' });
            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(mockToken, {
                secret: mockJwtSecret,
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(mockNewPassword, 10);
            expect(mockDb.update).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException for invalid token', async () => {
            const mockToken = 'invalid_token';
            const mockNewPassword = 'new_password';
            const mockJwtSecret = 'test-jwt-secret';

            // Mock config service
            mockConfigService.get.mockImplementation((key: string) => {
                if (key === 'JWT_SECRET') return mockJwtSecret;
                return undefined;
            });

            // Mock JWT verification to throw
            mockJwtService.verifyAsync.mockRejectedValueOnce(
                new Error('Invalid token'),
            );

            await expect(
                service.resetPassword(mockToken, mockNewPassword),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refreshTokens', () => {
        const mockRefreshToken = 'valid_refresh_token';

        it('should successfully refresh tokens', async () => {
            const mockPayload = {
                sub: 1,
                email: 'test@example.com',
            };

            // Mock jwtService.verifyAsync to return the payload
            mockJwtService.verifyAsync.mockResolvedValueOnce(mockPayload);

            const mockUser = {
                id: 1,
                email: mockPayload.email,
            };

            const mockUserRoles = [{ roleName: 'user' }];

            const selectChainUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([mockUser]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUser);

            const selectChainRoles = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockUserRoles),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainRoles);

            mockJwtService.signAsync.mockResolvedValueOnce('new_access_token');
            mockJwtService.signAsync.mockResolvedValueOnce('new_refresh_token');

            const result = await service.refreshTokens(mockRefreshToken);

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            mockJwtService.verifyAsync.mockRejectedValueOnce(new Error());

            await expect(
                service.refreshTokens('invalid_token'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        const mockEmail = 'test@example.com';
        const mockPassword = 'password123';

        it('should successfully validate user', async () => {
            const mockUser = {
                id: 1,
                email: mockEmail,
                passwordHash: 'hashed_password',
                firstName: 'John',
                lastName: 'Doe',
            };

            const mockUserRoles = [{ roleName: 'user' }];

            const selectChainUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([mockUser]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainUser);

            const selectChainRoles = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue(mockUserRoles),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainRoles);

            // Mock bcrypt.compare to return true
            (
                jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock
            ).mockResolvedValueOnce(true);

            const result = await service.validateUser(mockEmail, mockPassword);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('roles');
        });

        it('should return null for invalid credentials', async () => {
            const selectChainNoUser = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockResolvedValue([]),
                limit: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
            };
            mockDb.select.mockReturnValueOnce(selectChainNoUser);

            const result = await service.validateUser(mockEmail, mockPassword);

            expect(result).toBeNull();
        });
    });
});
