import React from 'react';
import { UserNav } from '../user-nav';
import { Session } from 'next-auth';

type Props = {
    session: Session;
    title: React.ReactNode;
};

export default function Header({ session, title }: Props) {
    return (
        <header className="bg-white border-b border-gray-200 px-8 h-20 flex items-center justify-between shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center">
                <div className="flex items-center mr-5 text-sm text-primary">
                    <i className="fas fa-calendar mr-1.5"></i>
                    Tax Year: 2026-2027
                </div>
                <div className="relative mr-5 cursor-pointer">
                    <i className="fas fa-bell"></i>
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        5
                    </div>
                </div>
                {session && <UserNav session={session} />}
            </div>
        </header>
    );
}
