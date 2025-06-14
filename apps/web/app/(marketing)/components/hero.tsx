import React from 'react';

type Props = {};

export default function Hero({}: Props) {
    return (
        <section className="bg-gradient-to-br from-blue-50 to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <i className="fas fa-calendar-check mr-2"></i>
                            MTD Deadline: April 2026
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Making Tax Digital
                            <span className="text-primary">Made Simple</span>
                            for Accounting Agencies
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Streamline your MTD compliance with AI-powered
                            document processing, automated client submissions,
                            and seamless HMRC integration. Get your agency and
                            clients ready for April 2026.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#register"
                                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="#demo"
                                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-primary hover:text-primary transition-colors"
                            >
                                Watch Demo
                            </a>
                        </div>
                        <div className="flex items-center mt-8 text-sm text-gray-500">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span>Free 30-day trial</span>
                            <span className="mx-4">•</span>
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span>No setup fees</span>
                            <span className="mx-4">•</span>
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                                <div className="text-sm text-gray-500">
                                    TAXAPP Dashboard
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-lg font-semibold text-gray-900">
                                        Client Submissions
                                    </div>
                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        24 Complete
                                    </div>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-primary">
                                                128
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Total Clients
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">
                                                97
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                MTD Ready
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-orange-600">
                                                7
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Pending
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <i className="fas fa-building text-blue-500 mr-3"></i>
                                            <span className="font-medium text-gray-900">
                                                Smith Consulting Ltd
                                            </span>
                                        </div>
                                        <div className="text-sm text-blue-600 font-medium">
                                            Q1 Ready
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <i className="fas fa-user text-green-500 mr-3"></i>
                                            <span className="font-medium text-gray-900">
                                                Taylor Freelance
                                            </span>
                                        </div>
                                        <div className="text-sm text-green-600 font-medium">
                                            Submitted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 bg-primary text-white p-3 rounded-lg shadow-lg">
                            <i className="fas fa-robot text-xl"></i>
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
                            <i className="fas fa-check text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
