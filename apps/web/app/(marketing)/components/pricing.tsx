import React from 'react';

type Props = {};

export default function Pricing({}: Props) {
    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the plan that fits your practice. All plans
                        include unlimited client submissions and 24/7 support.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Starter
                            </h3>
                            <div className="text-4xl font-bold text-primary mb-4">
                                £29
                                <span className="text-lg text-gray-500 font-normal">
                                    /month
                                </span>
                            </div>
                            <p className="text-gray-600 mb-8">
                                Perfect for small practices
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Up to 25 clients</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>AI document processing</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>HMRC integration</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Email support</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Basic reporting</span>
                            </li>
                        </ul>

                        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Start Free Trial
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border-2 border-primary relative hover:shadow-lg transition-shadow">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                                Most Popular
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Professional
                            </h3>
                            <div className="text-4xl font-bold text-primary mb-4">
                                £79
                                <span className="text-lg text-gray-500 font-normal">
                                    /month
                                </span>
                            </div>
                            <p className="text-gray-600 mb-8">
                                For growing practices
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Up to 100 clients</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Everything in Starter</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Team collaboration</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Priority support</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Advanced analytics</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>White-label client portal</span>
                            </li>
                        </ul>

                        <button className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                            Start Free Trial
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Enterprise
                            </h3>
                            <div className="text-4xl font-bold text-primary mb-4">
                                £199
                                <span className="text-lg text-gray-500 font-normal">
                                    /month
                                </span>
                            </div>
                            <p className="text-gray-600 mb-8">
                                For large practices
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Unlimited clients</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Everything in Professional</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Dedicated account manager</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Phone support</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>Custom integrations</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-check text-green-500 mr-3"></i>
                                <span>API access</span>
                            </li>
                        </ul>

                        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        All plans include a 30-day free trial. No setup fees.
                        Cancel anytime.
                    </p>
                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                        <div className="flex items-center">
                            <i className="fas fa-shield-alt mr-2"></i>
                            <span>Secure payments</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-sync-alt mr-2"></i>
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-headset mr-2"></i>
                            <span>24/7 support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
