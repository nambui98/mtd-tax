import React from 'react';

type Props = {};

export default function Support({}: Props) {
    return (
        <section id="support" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        World-Class Support When You Need It
                    </h2>
                    <p className="text-xl text-gray-600">
                        Our team of MTD experts is here to help you succeed
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-headset text-2xl text-primary"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            24/7 Technical Support
                        </h3>
                        <p className="text-gray-600">
                            Get help anytime with our 24/7 technical support.
                            Average response time under 2 hours for all plans.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-graduation-cap text-2xl text-green-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            MTD Training
                        </h3>
                        <p className="text-gray-600">
                            Comprehensive training resources, webinars, and
                            certification courses to ensure your team is
                            MTD-ready.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-rocket text-2xl text-purple-600"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Migration Assistance
                        </h3>
                        <p className="text-gray-600">
                            Free migration from your existing systems. Our team
                            handles the technical details so you can focus on
                            your clients.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a
                        href="#register"
                        className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </section>
    );
}
