import React from 'react';

type Props = {};

export default function Faq({}: Props) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about TAXAPP and Making Tax
                        Digital
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What is Making Tax Digital and when does it
                                start?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            Making Tax Digital (MTD) for Income Tax Self
                            Assessment becomes mandatory from April 2026 for
                            self-employed individuals and landlords with income
                            over £10,000. It requires digital record-keeping and
                            quarterly submissions to HMRC.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                How does TAXAPP connect to HMRC?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            TAXAPP integrates directly with HMRC's APIs using
                            your Agent Reference Number (ARN). This allows us to
                            submit quarterly updates and annual declarations on
                            behalf of your clients securely and compliantly.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                How does the AI document processing work?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            Our AI uses advanced OCR and machine learning to
                            extract data from receipts, invoices, and bank
                            statements. It automatically categorizes
                            transactions according to HMRC requirements, with
                            95%+ accuracy. You can review and adjust before
                            finalizing.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can my clients use TAXAPP directly?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            Yes! Your clients get access to a simple
                            mobile-friendly portal where they can upload
                            documents, view their financial summaries, and
                            communicate with your team. You maintain full
                            control over submissions and final approvals.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Is there a limit on the number of submissions?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            No. All our plans include unlimited quarterly
                            submissions and annual declarations for your
                            clients. There are no additional fees per submission
                            or transaction.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                What support do you provide during the trial?
                            </h3>
                            <i className="fas fa-chevron-down text-gray-400 mt-1"></i>
                        </div>
                        <p className="text-gray-600">
                            We provide full onboarding support including setup
                            assistance, HMRC connection help, staff training,
                            and client migration support. Our customer success
                            team is available throughout your trial.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
