import React from 'react';

type Props = {};

export default function Socials({}: Props) {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Trusted by Leading Accounting Practices
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join hundreds of practices already preparing for MTD
                        with TAXAPP
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                            500+
                        </div>
                        <div className="text-gray-600">
                            Accounting Practices
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                            15,000+
                        </div>
                        <div className="text-gray-600">Clients Onboarded</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                            99.9%
                        </div>
                        <div className="text-gray-600">Uptime Guarantee</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-50 rounded-xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                SJ
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    Sarah Johnson
                                </div>
                                <div className="text-sm text-gray-500">
                                    Managing Partner, Johnson & Associates
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">
                            "TAXAPP transformed our MTD preparation. The AI
                            document processing alone saves us 15 hours per
                            week, and our clients love the simple mobile
                            interface."
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                MT
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    Mike Thompson
                                </div>
                                <div className="text-sm text-gray-500">
                                    Director, Thompson Tax Solutions
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">
                            "The HMRC integration is seamless. We've already
                            submitted over 200 quarterly updates without a
                            single error. Our confidence in MTD compliance is
                            100%."
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                EP
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    Emma Parker
                                </div>
                                <div className="text-sm text-gray-500">
                                    Senior Accountant, Parker & Co
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">
                            "The client portal is fantastic. Our clients can
                            upload documents instantly, and we can review and
                            categorize them in minutes rather than hours."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
