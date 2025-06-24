import React from 'react';
import Header from './header';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Props = {
    children: React.ReactNode;
    title: React.ReactNode;
};

export default async function MainPageWrapper({ children, title }: Props) {
    const session = await getServerSession(authOptions);
    return (
        <div className="flex-1 overflow-y-auto">
            <Header title={title} session={session as Session} />
            <div className="p-5">{children}</div>
        </div>
    );
}
