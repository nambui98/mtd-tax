import React from 'react';

type Props = {};

export default function Features({}: Props) {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Everything Your Agency Needs for MTD Success
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From AI-powered document processing to seamless HMRC
                        submissions, TAXAPP handles the complexity so you can
                        focus on growing your practice.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-robot text-2xl text-primary"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            AI Document Processing
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Automatically extract data from receipts, invoices,
                            and bank statements. Our AI categorizes transactions
                            and reduces manual entry by 85%.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                OCR text extraction
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Smart categorization
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Batch processing
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-link text-2xl text-green-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            HMRC Integration
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Direct connection to HMRC APIs for seamless
                            quarterly submissions and annual declarations. Full
                            MTD compliance built-in.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Agent authorization
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Automated submissions
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Real-time validation
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-users text-2xl text-purple-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Client Management
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Manage unlimited clients with role-based access,
                            automated workflows, and real-time collaboration
                            tools.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Unlimited clients
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Team collaboration
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Client portals
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-calendar-check text-2xl text-orange-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Deadline Management
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Never miss a deadline with automated reminders,
                            deadline tracking, and submission status monitoring
                            across all clients.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Automated reminders
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Status tracking
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Email notifications
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-shield-alt text-2xl text-red-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Bank-Level Security
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Enterprise-grade security with 256-bit encryption,
                            GDPR compliance, and secure document storage with
                            audit trails.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                256-bit encryption
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                GDPR compliant
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Audit trails
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                            <i className="fas fa-chart-line text-2xl text-indigo-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Practice Analytics
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Gain insights into your practice with detailed
                            analytics, performance metrics, and client
                            profitability reports.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Revenue tracking
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Efficiency metrics
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Custom reports
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
