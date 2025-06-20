import Link from 'next/link';
import React from 'react';

type Props = {};

export default function Navigation({}: Props) {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <div className="text-2xl font-semibold text-primary mr-3">
                            TAXAPP
                        </div>
                        <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded">
                            MTD Ready
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#features"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Pricing
                        </a>
                        <a
                            href="#support"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Support
                        </a>
                        <Link
                            href="/sign-in"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <a
                            href="#register"
                            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                        >
                            Get Started Free
                        </a>
                    </div>
                    <div className="md:hidden">
                        <button className="text-gray-600">
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
