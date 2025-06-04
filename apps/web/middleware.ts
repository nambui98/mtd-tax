import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Export withAuth middleware with basic configuration
export default withAuth(
    // `withAuth` augments your Request with the user's token
    (_request) => {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    },
);

// See "Matching Paths" below to learn more
export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
    matcher: ['/dashboard'],
};
