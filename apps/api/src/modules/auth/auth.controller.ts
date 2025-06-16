import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
    loginSchema,
    verifyOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokensSchema,
} from './auth.schema';
import {
    InsertCompany,
    insertCompanySchema,
    InsertUser,
    insertUserSchema,
} from '@workspace/database/dist/schema';
import z from 'zod';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'User registered successfully',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'user@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        roles: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['user'],
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async signup(
        @Body(
            new ZodValidationPipe(
                z.object({
                    user: insertUserSchema,
                    company: insertCompanySchema,
                }),
            ),
        )
        signupDto: {
            user: InsertUser;
            company: InsertCompany;
        },
    ) {
        return this.authService.signup(signupDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refresh_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'user@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        roles: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['user'],
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
        @Body(new ZodValidationPipe(loginSchema))
        loginDto: {
            email: string;
            password: string;
        },
    ) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP for user' })
    @ApiResponse({
        status: 200,
        description: 'OTP successfully verified',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refresh_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'user@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        roles: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['user'],
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid OTP' })
    async verifyOTP(
        @Body(new ZodValidationPipe(verifyOtpSchema))
        verifyOtpDto: {
            email: string;
            otp: string;
        },
    ) {
        return this.authService.verifyOTP(verifyOtpDto.email, verifyOtpDto.otp);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Password reset email sent',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'User not found' })
    async forgotPassword(
        @Body(new ZodValidationPipe(forgotPasswordSchema))
        forgotPasswordDto: {
            email: string;
        },
    ) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiResponse({
        status: 200,
        description: 'Password successfully reset',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Password reset successfully',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid or expired token' })
    async resetPassword(
        @Body(new ZodValidationPipe(resetPasswordSchema))
        resetPasswordDto: {
            token: string;
            newPassword: string;
        },
    ) {
        return this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
    }

    @Post('refresh-tokens')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({
        status: 200,
        description: 'Tokens successfully refreshed',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refresh_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshTokens(
        @Body(new ZodValidationPipe(refreshTokensSchema))
        refreshTokensDto: {
            refreshToken: string;
        },
    ) {
        if (!refreshTokensDto.refreshToken) {
            throw new BadRequestException('Refresh token is required');
        }
        return this.authService.refreshTokens(refreshTokensDto.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                roles: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['user'],
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(
        @Request()
        req: {
            user: { sub: number; email: string; roles: string[] };
        },
    ) {
        return this.authService.getProfile(req.user);
    }
}
