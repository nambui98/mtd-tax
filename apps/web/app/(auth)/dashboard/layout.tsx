import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { authOptions } from '@/lib/auth';
import { getServerSession, Session } from 'next-auth';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
    const session = await getServerSession(authOptions);
    return (
        <div className="bg-gray-50 text-gray-700 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]">
            <div className="flex min-h-screen">
                <Sidebar />
                {/* <MainPageWapper session={session as Session} title={title}> */}
                {children}
                {/* </MainPageWapper> */}
            </div>
        </div>
    );
}
