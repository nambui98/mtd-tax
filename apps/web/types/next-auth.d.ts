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
            practiceType?: string | null;
            hmrcConnected?: boolean | null;
            agentReferenceNumber?: string | null;
            utr?: string | null;
            nino?: string | null;
            hmrcConnectedAt?: Date | null;
            isActive?: boolean | null;
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
        practiceType?: string | null;
        hmrcConnected?: boolean | null;
        agentReferenceNumber?: string | null;
        utr?: string | null;
        nino?: string | null;
        hmrcConnectedAt?: Date | null;
        isActive?: boolean | null;
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
            practiceType?: string | null;
            hmrcConnected?: boolean | null;
            agentReferenceNumber?: string | null;
            utr?: string | null;
            nino?: string | null;
            hmrcConnectedAt?: Date | null;
            isActive?: boolean | null;
        };
        error?: string;
    }
}
