'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { hmrcService } from '@/services/hmrc';

export default function HmrcCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            debugger;
            try {
                // Get the authorization code and state from URL
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');

                // Check for errors from HMRC
                if (error) {
                    toast.error(`HMRC authorization failed: ${error}`);
                    router.push('/registration?step=step4');
                    return;
                }

                // Verify state
                const storedState = localStorage.getItem('hmrc_state');
                if (!state || state !== storedState) {
                    toast.error('Invalid state parameter. Please try again.');
                    router.push('/registration?step=step4');
                    return;
                }

                // Clear the stored state
                localStorage.removeItem('hmrc_state');

                if (!code) {
                    toast.error('No authorization code received from HMRC');
                    router.push('/registration?step=step4');
                    return;
                }

                // Exchange code for token
                const response = await hmrcService.exchangeCodeForToken(code);

                if (response.status === 200) {
                    toast.success('Successfully connected to HMRC');
                    // Redirect to the next step or dashboard
                    router.push('/registration?step=step5');
                } else {
                    throw new Error('Failed to exchange code for token');
                }
            } catch (error) {
                console.error('Error handling HMRC callback:', error);
                toast.error(
                    'Failed to complete HMRC connection. Please try again.',
                );
                router.push('/registration?step=step4');
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    Processing HMRC Connection
                </h1>
                <p className="text-gray-600">
                    Please wait while we complete your HMRC connection...
                </p>
                <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                </div>
            </div>
        </div>
    );
}
