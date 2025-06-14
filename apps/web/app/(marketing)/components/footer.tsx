import React from 'react';

type Props = {};

export default function Footer({}: Props) {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="text-2xl font-semibold text-white mr-3">
                                TAXAPP
                            </div>
                            <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded">
                                MTD Ready
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Making Tax Digital made simple for accounting
                            agencies and their clients.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fab fa-youtube text-xl"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#features"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Security
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Integrations
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    API
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    MTD Guide
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Webinars
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#support"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Press
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 mb-4 md:mb-0">
                        © 2024 TAXAPP. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center">
                            <i className="fas fa-shield-alt mr-2"></i>
                            <span>GDPR Compliant</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-lock mr-2"></i>
                            <span>256-bit Encryption</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle mr-2"></i>
                            <span>HMRC Approved</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
