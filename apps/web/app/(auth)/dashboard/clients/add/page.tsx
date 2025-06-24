import MainPageWrapper from '@/components/layout/main-page-wrapper';
import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import MainContent from './components/main-content';

export default function AddClientPage() {
    return (
        <MainPageWrapper
            title={
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/clients">
                        <ArrowLeftIcon className="size-8" />
                    </Link>
                    Add Client
                </div>
            }
        >
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-md p-4 mb-6 w-full">
                <div className="font-semibold mb-1">
                    Set Up New Tier 2 MTD Client
                </div>
                <p className="text-sm">
                    Use this form to add a new client to your practice. After
                    adding the client, you'll be able to set up their MTD
                    account and assign staff members.
                </p>
            </div>
            <MainContent />
        </MainPageWrapper>
    );
}
