import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react';
import SignInForm from './components/sign-in-form';

export default async function SignInPage() {
    const session = await getServerSession();

    if (session) {
        redirect('/');
    }
    return <SignInForm />;
}
