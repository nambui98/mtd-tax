import type { AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions as unknown as AuthOptions);

export { handler as GET, handler as POST };
