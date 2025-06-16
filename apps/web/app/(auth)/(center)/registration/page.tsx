import React from 'react';
import Content, { Step } from './components/content';

// type Props = {
//     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
type Props = {
    searchParams: Promise<{ step: Step }>;
};

export default async function RegistrationPage({ searchParams }: Props) {
    const { step } = await searchParams;
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Content step={step} />
        </div>
    );
}
