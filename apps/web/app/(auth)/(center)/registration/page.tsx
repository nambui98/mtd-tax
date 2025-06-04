import React from 'react';
import Step1 from './components/step-1';
import Content from './components/content';

type Props = {};

export default function RegistrationPage({}: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Content />
        </div>
    );
}
