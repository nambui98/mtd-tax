import React from 'react';

type Props = {};

export default function Step5({}: Props) {
    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Connecting to HMRC
                </h2>
                <p className="text-gray-600">
                    Authorizing your agency with HMRC
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Redirecting to HMRC
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        You'll be redirected to HMRC's secure authorization page
                        to complete the connection process.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                        <div className="flex items-start">
                            <i className="fas fa-shield-alt text-blue-500 mt-0.5 mr-3"></i>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-2">
                                    What happens next:
                                </p>
                                <ol className="list-decimal ml-4 space-y-1">
                                    <li>
                                        Login with your Government Gateway
                                        credentials
                                    </li>
                                    <li>
                                        Review and accept the authorization
                                        request
                                    </li>
                                    <li>
                                        You'll be redirected back to complete
                                        setup
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                window.location.href =
                                    'https://www.gov.uk/government/organisations/hm-revenue-customs/about/online-services-account';
                            }}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        >
                            Continue to HMRC Authorization
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = '/dashboard';
                            }}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel and Set Up Later
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
