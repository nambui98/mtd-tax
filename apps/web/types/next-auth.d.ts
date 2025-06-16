/* eslint-disable ts/consistent-type-definitions */
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    /**
     * Extending the built-in session types
     */
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            firstName?: string | null;
            lastName?: string | null;
        };
    }

    /**
     * Extending the built-in user types
     */
    interface User {
        id: string;
        name?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        image?: string | null;
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
    }
}

declare module 'next-auth/jwt' {
    /**
     * Extending the built-in JWT types
     */
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
            firstName?: string | null;
            lastName?: string | null;
        };
        error?: string;
    }
}
