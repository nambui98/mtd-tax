import type { SessionStrategy, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Env } from './env';

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
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');

                    if (response.ok && data.data.access_token) {
                        return {
                            id: data.data.user.id,
                            firstName: data.data.user.firstName,
                            lastName: data.data.user.lastName,
                            email: data.data.user.email || credentials?.email,
                            accessToken: data.data.access_token,
                            refreshToken: data.data.refresh_token,
                            expiresIn: data.data.expires_in * 1000,
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
                session: { label: 'Session', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(
                        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-otp`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials?.email,
                                otp: credentials?.otp,
                                session: credentials?.session,
                            }),
                        },
                    );
                    const data = await response.json();
                    if (response.ok && data.tokens.accessToken) {
                        return {
                            id: data.user.id,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            email: data.user.email || credentials?.email,
                            accessToken: data.tokens.accessToken,
                            refreshToken: data.tokens.refreshToken,
                            tokenExpiry:
                                Date.now() + data.tokens.expiresIn * 1000,
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
                };
            }

            const now = Date.now();
            if (token.expiresAt && now < token.expiresAt) {
                return token;
            }
            //refresh token
            // return await authService.refreshAccessToken(token);
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
        maxAge: 30 * 24 * 60 * 60,
    },
};
