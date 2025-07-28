import { Button } from '@workspace/ui/components/button';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {};

export default function Step6({}: Props) {
    return (
        <>
            <div className="max-w-lg w-full space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckIcon className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome to TAXAPP!
                    </h2>
                    <p className="text-gray-600">
                        Your agency account has been successfully created
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-semibold text-gray-900 mb-1">
                                    1
                                </div>
                                <div className="text-sm text-gray-500">
                                    Agency Created
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-semibold text-gray-900 mb-1">
                                    0
                                </div>
                                <div className="text-sm text-gray-500">
                                    Clients Added
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Next Steps
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            Add Your Staff
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Create accounts for your team
                                            members
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            Add Your Clients
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Start onboarding your clients to the
                                            platform
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            Configure HMRC Integration
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Complete HMRC connection if not done
                                            already
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <i className="fas fa-lightbulb text-blue-500 mt-0.5 mr-3"></i>
                                    <p className="font-medium mb-1">Pro Tip:</p>
                                    <p>
                                        Start by adding a few test clients to
                                        familiarize yourself with the platform
                                        before the MTD deadline in April 2026.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            size={'xl'}
                            className="w-full text-base"
                            asChild
                        >
                            <Link href="/dashboard/clients">
                                Go to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
