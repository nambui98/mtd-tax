import type { SessionStrategy, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Env } from './env';
import { authService } from '@/services/auth';

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: 'local',
            name: 'Email and Password',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(
                        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                        },
                    );

                    const data = await response.json();

                    if (response.ok && data.data.access_token) {
                        return {
                            id: data.data.user.id,
                            firstName: data.data.user.firstName,
                            lastName: data.data.user.lastName,
                            email: data.data.user.email || credentials?.email,
                            accessToken: data.data.access_token,
                            refreshToken: data.data.refresh_token,
                            expiresIn: data.data.expires_in,
                            practiceType: data.data.user.practiceType,
                            hmrcConnected: data.data.user.hmrcConnected,
                            agentReferenceNumber:
                                data.data.user.agentReferenceNumber,
                            utr: data.data.user.utr,
                            nino: data.data.user.nino,
                            hmrcConnectedAt: data.data.user.hmrcConnectedAt,
                        };
                    }
                    throw new Error(data.message);
                } catch (error) {
                    console.error('Auth error:', error);
                    throw error;
                }
            },
        }),

        CredentialsProvider({
            id: 'email-otp',
            name: 'Email with OTP',
            credentials: {
                email: { label: 'Email', type: 'text' },
                otp: { label: 'Verification Code', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(
                        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-login-otp`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials?.email,
                                otp: credentials?.otp,
                            }),
                        },
                    );
                    const data = await response.json();
                    if (response.ok && data.data.access_token) {
                        return {
                            id: data.data.user.id,
                            firstName: data.data.user.firstName,
                            lastName: data.data.user.lastName,
                            email: data.data.user.email || credentials?.email,
                            accessToken: data.data.access_token,
                            refreshToken: data.data.refresh_token,
                            expiresIn: data.data.expires_in,
                            practiceType: data.data.user.practiceType,
                            hmrcConnected: data.data.user.hmrcConnected,
                            agentReferenceNumber:
                                data.data.user.agentReferenceNumber,
                            utr: data.data.user.utr,
                            nino: data.data.user.nino,
                            hmrcConnectedAt: data.data.user.hmrcConnectedAt,
                        };
                    } else {
                        throw new Error(data.error.message);
                    }
                } catch (error: any) {
                    console.error('OTP auth error:', error.message);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({
            token,
            user,
        }: {
            token: Record<string, any>;
            user?: User;
        }) {
            // Initial sign in
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expiresAt = Date.now() + (user.expiresIn || 3600) * 1000;
                token.user = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    practiceType: user.practiceType,
                    hmrcConnected: user.hmrcConnected,
                    agentReferenceNumber: user.agentReferenceNumber,
                    utr: user.utr,
                    nino: user.nino,
                    hmrcConnectedAt: user.hmrcConnectedAt,
                };
            }

            const now = Date.now();
            if (token.expiresAt && now < token.expiresAt) {
                return token;
            }
            // Token has expired, try to refresh it
            if (token.refreshToken) {
                return await authService.refreshAccessToken(token);
            }

            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Record<string, any>;
            token: Record<string, any>;
        }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;
            session.user = token.user || { id: 'unknown' };

            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 1 * 60 * 60,
    },
};
