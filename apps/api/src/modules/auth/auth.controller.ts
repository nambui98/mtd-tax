import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { z } from 'zod';
import {
    InsertUser,
    InsertCompany,
    InsertHMRC,
} from '@workspace/database/dist/schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

type LoginDto = z.infer<typeof loginSchema>;
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @Post('signup')
    async signup(
        @Body()
        signupDto: {
            user: InsertUser & InsertHMRC;
            company: InsertCompany;
        },
    ) {
        return this.authService.signup(signupDto);
    }

    @Post('verify-otp')
    async verifyOTP(
        @Body()
        verifyOTPDto: {
            otp: string;
            email: string;
        },
    ) {
        return this.authService.verifyOTP(verifyOTPDto.email, verifyOTPDto.otp);
    }

    @Post('signin-with-password')
    async signinWithPassword(
        @Body() signinDto: { email: string; password: string },
    ) {
        const response = await this.authService.signInWithPassword(
            signinDto.email,
            signinDto.password,
        );
        if (
            response.AuthenticationResult &&
            response.AuthenticationResult.IdToken
        ) {
            const idToken = response.AuthenticationResult.IdToken;
            const decodedToken = this.decodeJwtToken(idToken);
            return {
                tokens: {
                    accessToken: response.AuthenticationResult.AccessToken,
                    idToken: idToken,
                    refreshToken: response.AuthenticationResult.RefreshToken,
                    expiresIn: response.AuthenticationResult.ExpiresIn,
                },
                user: {
                    id: decodedToken?.sub,
                    username: signinDto.email,
                    firstName: decodedToken?.given_name || '',
                    lastName: decodedToken?.family_name || '',
                    email: decodedToken?.email || signinDto.email,
                },
                message: 'User authenticated successfully.',
            };
        }
    }
    private decodeJwtToken(token: string): {
        sub: string;
        given_name: string;
        family_name: string;
        email: string;
    } | null {
        try {
            const base64Payload = token.split('.')[1];
            const jsonPayload = Buffer.from(base64Payload, 'base64').toString(
                'utf8',
            );
            return JSON.parse(jsonPayload) as {
                sub: string;
                given_name: string;
                family_name: string;
                email: string;
            };
        } catch (error) {
            console.error('Error decoding JWT token', error);
            return null;
        }
    }
}
