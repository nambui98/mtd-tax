import type { JWT } from 'next-auth/jwt';
import { Env } from '@/lib/env';
import { api } from './api';

export type SignupData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
    acceptReceiveNews?: boolean;
};

export type SignupResponse = {
    userId: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
};

export type OtpRequestResponse = {
    challengeName: string;
    session: string;
    message: string;
};

export type OtpVerifyResponse = {
    success: boolean;
    userId?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
};

export type LoginOtpRequestResponse = {
    message: string;
};

export type LoginOtpVerifyResponse = {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    };
};

export const authService = {
    /**
     * Register a new user
     */
    signup: async (data: SignupData): Promise<SignupResponse> => {
        const response = await api.post<SignupResponse>('/auth/signup', data);
        return response.data;
    },

    confirmSignup: async (
        email: string,
        confirmationCode: string,
    ): Promise<{ success: boolean }> => {
        const response = await api.post('/auth/confirm-signup', {
            email,
            confirmationCode,
        });
        return response.data;
    },

    /**
     * Verify email with verification code
     */
    verifyEmail: async (
        email: string,
        code: string,
    ): Promise<{ success: boolean }> => {
        const response = await api.post('/auth/verify-email', { email, code });
        return response.data;
    },

    /**
     * Request OTP for login
     */
    requestOtp: async (email: string): Promise<OtpRequestResponse> => {
        const response = await api.post('/auth/signin', { email });
        return response.data.data;
    },

    /**
     * Request OTP for login (new method)
     */
    requestLoginOtp: async (
        email: string,
    ): Promise<LoginOtpRequestResponse> => {
        const response = await api.post('/auth/request-login-otp', { email });
        return response.data;
    },

    /**
     * Verify OTP for login
     */
    verifyOTP: async (
        email: string,
        otp: string,
    ): Promise<LoginOtpVerifyResponse> => {
        const response = await api.post('/auth/verify-login-otp', {
            email,
            otp,
        });

        // Store tokens in localStorage
        if (response.data.access_token) {
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('refreshToken', response.data.refresh_token);
        }

        return response.data;
    },

    refreshAccessToken: async (token: Record<string, any>): Promise<JWT> => {
        try {
            const response = await fetch(
                `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh-tokens`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        refreshToken: token.refreshToken,
                        email: token.user.email,
                    }),
                },
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            return {
                ...token,
                accessToken: data.tokens.accessToken,
                refreshToken: data.tokens.refreshToken || token.refreshToken, // Use new refresh token if provided
                expiresAt: Date.now() + data.tokens.expiresIn * 1000,
            };
        } catch (error) {
            console.error('Error refreshing access token', error);

            // The error property will be used client-side to handle the refresh token error
            return {
                ...token,
                error: 'RefreshAccessTokenError',
            };
        }
    },
};
