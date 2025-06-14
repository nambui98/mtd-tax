/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signup: jest.fn(),
        login: jest.fn(),
        verifyOTP: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        refreshTokens: jest.fn(),
        getProfile: jest.fn(),
        logout: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        })
            .overrideGuard(LocalAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
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
            const expectedResponse = {
                message: 'User created successfully',
                qrCode: 'mock-qr-code',
                user: {
                    id: 1,
                    email: mockSignupDto.user.email,
                    firstName: mockSignupDto.user.firstName,
                    lastName: mockSignupDto.user.lastName,
                },
            };

            mockAuthService.signup.mockResolvedValue(expectedResponse);

            const result = await controller.signup(mockSignupDto);

            expect(result).toEqual(expectedResponse);
            expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
        });

        it('should throw BadRequestException when user already exists', async () => {
            mockAuthService.signup.mockRejectedValue(
                new BadRequestException('User already exists'),
            );

            await expect(controller.signup(mockSignupDto)).rejects.toThrow(
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
            const expectedResponse = {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                user: {
                    id: 1,
                    email: mockLoginDto.email,
                    firstName: 'John',
                    lastName: 'Doe',
                    roles: ['user'],
                },
            };

            mockAuthService.login.mockResolvedValue(expectedResponse);

            const result = await controller.login(mockLoginDto);

            expect(result).toEqual(expectedResponse);
            expect(authService.login).toHaveBeenCalledWith(
                mockLoginDto.email,
                mockLoginDto.password,
            );
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            mockAuthService.login.mockRejectedValue(
                new UnauthorizedException('Invalid credentials'),
            );

            await expect(controller.login(mockLoginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('verifyOTP', () => {
        const mockVerifyOtpDto = {
            email: 'test@example.com',
            token: '123456',
        };

        it('should successfully verify OTP', async () => {
            const expectedResponse = {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                user: {
                    id: 1,
                    email: mockVerifyOtpDto.email,
                    firstName: 'John',
                    lastName: 'Doe',
                    roles: ['user'],
                },
            };

            mockAuthService.verifyOTP.mockResolvedValue(expectedResponse);

            const result = await controller.verifyOTP({
                email: mockVerifyOtpDto.email,
                otp: mockVerifyOtpDto.token,
            });

            expect(result).toEqual(expectedResponse);
            expect(authService.verifyOTP).toHaveBeenCalledWith(
                mockVerifyOtpDto.email,
                mockVerifyOtpDto.token,
            );
        });

        it('should throw UnauthorizedException for invalid OTP', async () => {
            mockAuthService.verifyOTP.mockRejectedValue(
                new UnauthorizedException('Invalid OTP'),
            );

            await expect(
                controller.verifyOTP({
                    email: mockVerifyOtpDto.email,
                    otp: mockVerifyOtpDto.token,
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('forgotPassword', () => {
        const mockForgotPasswordDto = {
            email: 'test@example.com',
        };

        it('should successfully send password reset email', async () => {
            const expectedResponse = {
                message: 'Password reset email sent',
            };

            mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

            const result = await controller.forgotPassword(
                mockForgotPasswordDto,
            );

            expect(result).toEqual(expectedResponse);
            expect(authService.forgotPassword).toHaveBeenCalledWith(
                mockForgotPasswordDto.email,
            );
        });

        it('should throw UnauthorizedException when user not found', async () => {
            mockAuthService.forgotPassword.mockRejectedValue(
                new UnauthorizedException('User not found'),
            );

            await expect(
                controller.forgotPassword(mockForgotPasswordDto),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('resetPassword', () => {
        const mockResetPasswordDto = {
            token: 'mock-reset-token',
            newPassword: 'newpassword123',
            confirmPassword: 'newpassword123',
        };

        it('should successfully reset password', async () => {
            const expectedResponse = {
                message: 'Password reset successfully',
            };

            mockAuthService.resetPassword.mockResolvedValue(expectedResponse);

            const result = await controller.resetPassword(mockResetPasswordDto);

            expect(result).toEqual(expectedResponse);
            expect(authService.resetPassword).toHaveBeenCalledWith(
                mockResetPasswordDto.token,
                mockResetPasswordDto.newPassword,
            );
        });

        it('should throw UnauthorizedException for invalid token', async () => {
            mockAuthService.resetPassword.mockRejectedValue(
                new UnauthorizedException('Invalid or expired token'),
            );

            await expect(
                controller.resetPassword(mockResetPasswordDto),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refreshTokens', () => {
        it('should throw BadRequestException when refresh token is missing', async () => {
            await expect(
                controller.refreshTokens({ refreshToken: '' }),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            const mockRefreshToken = 'invalid_token';
            mockAuthService.refreshTokens.mockRejectedValueOnce(
                new UnauthorizedException('Invalid refresh token'),
            );

            await expect(
                controller.refreshTokens({ refreshToken: mockRefreshToken }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should return new tokens when refresh token is valid', async () => {
            const mockRefreshToken = 'valid_token';
            const mockResponse = {
                access_token: 'new_access_token',
                refresh_token: 'new_refresh_token',
            };

            mockAuthService.refreshTokens.mockResolvedValueOnce(mockResponse);

            const result = await controller.refreshTokens({
                refreshToken: mockRefreshToken,
            });

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
                mockRefreshToken,
            );
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                sub: 1,
                email: 'test@example.com',
                roles: ['user'],
            };

            const mockProfile = {
                id: mockUser.sub,
                email: mockUser.email,
                firstName: 'John',
                lastName: 'Doe',
                roles: mockUser.roles,
            };

            mockAuthService.getProfile.mockResolvedValueOnce(mockProfile);

            const result = await controller.getProfile({ user: mockUser });

            expect(result).toEqual(mockProfile);
            expect(mockAuthService.getProfile).toHaveBeenCalledWith(mockUser);
        });
    });
});
