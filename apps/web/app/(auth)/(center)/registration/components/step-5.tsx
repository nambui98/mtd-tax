import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { hmrcService } from '@/services/hmrc';

type Props = {
    onNext?: () => void;
};

export default function Step5({ onNext }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the authorization code and state from URL
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');

                // Check for errors from HMRC
                if (error) {
                    setError(`HMRC authorization failed: ${error}`);
                    setIsProcessing(false);
                    return;
                }

                // Verify state
                const storedState = localStorage.getItem('hmrc_state');
                if (!state || state !== storedState) {
                    setError('Invalid state parameter. Please try again.');
                    setIsProcessing(false);
                    return;
                }

                // Clear the stored state
                localStorage.removeItem('hmrc_state');

                if (!code) {
                    setError('No authorization code received from HMRC');
                    setIsProcessing(false);
                    return;
                }

                // Exchange code for token
                const response = await hmrcService.exchangeCodeForToken(code);

                if (response.status === 200) {
                    setIsSuccess(true);
                    toast.success('Successfully connected to HMRC');
                    // Wait a moment before proceeding to next step
                    setTimeout(() => {
                        if (onNext) {
                            onNext();
                        } else {
                            router.push('/dashboard');
                        }
                    }, 2000);
                } else {
                    throw new Error('Failed to exchange code for token');
                }
            } catch (error) {
                console.error('Error handling HMRC callback:', error);
                setError(
                    'Failed to complete HMRC connection. Please try again.',
                );
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [router, searchParams, onNext]);

    if (error) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Connection Failed
                </h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => router.push('/registration?step=step4')}
                    className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Connection Successful
                </h2>
                <p className="text-gray-600 mb-4">
                    Your agency has been successfully connected to HMRC
                </p>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <p className="text-sm text-gray-500">
                    Redirecting to the next step...
                </p>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connecting to HMRC
            </h2>
            <p className="text-gray-600">Authorizing your agency with HMRC</p>

            <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Processing Authorization
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Please wait while we complete your HMRC connection...
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-500 mt-0.5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-2">
                                    What happens next:
                                </p>
                                <ol className="list-decimal ml-4 space-y-1">
                                    <li>
                                        We're processing your HMRC authorization
                                    </li>
                                    <li>Setting up your agency's access</li>
                                    <li>
                                        You'll be redirected to complete setup
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
