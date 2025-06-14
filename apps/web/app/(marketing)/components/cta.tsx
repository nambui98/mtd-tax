import React from 'react';

type Props = {};

export default function Cta({}: Props) {
    return (
        <section id="register" className="py-20 bg-primary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Ready to Get MTD Ready?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Join hundreds of accounting practices already using TAXAPP
                    to prepare for Making Tax Digital. Start your free trial
                    today – no credit card required.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <a
                        href="agency-registration-flow.html"
                        className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Start Your Free Trial
                    </a>
                    <a
                        href="#demo"
                        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
                    >
                        Schedule a Demo
                    </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
                    <div className="flex items-center">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>Ready in under 10 minutes</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-users mr-2"></i>
                        <span>500+ practices trust TAXAPP</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-clock mr-2"></i>
                        <span>Save 15+ hours per week</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
