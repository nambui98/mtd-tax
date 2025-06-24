'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@workspace/ui/lib/utils';

type Props = {};

export default function Sidebar({}: Props) {
    const pathname = usePathname();
    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm z-10">
            <div className="px-5 h-20 border-b border-gray-200 flex items-center">
                <div className="flex items-center">
                    <div className="text-2xl font-semibold text-primary mr-2">
                        TAXAPP
                    </div>
                    <div className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
                        MTD Ready
                    </div>
                </div>
            </div>
            <nav className="py-5">
                <div className="mb-4">
                    <div className="px-5 text-xs uppercase text-gray-500 font-semibold">
                        Main
                    </div>
                    <Link
                        href="/dashboard"
                        className={cn(
                            'flex items-center px-5 py-2.5 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname === '/dashboard' &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-chart-line w-5 text-center mr-2.5"></i>
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/clients"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/clients') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-users w-5 text-center mr-2.5"></i>
                        Clients
                    </Link>
                    <Link
                        href="/dashboard/submissions"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/submissions') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-clipboard-list w-5 text-center mr-2.5"></i>
                        Submissions
                    </Link>
                    <Link
                        href="/dashboard/documents"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/documents') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-folder w-5 text-center mr-2.5"></i>
                        Documents
                    </Link>
                </div>
                <div className="mb-4">
                    <div className="px-5 text-xs uppercase text-gray-500 font-semibold">
                        Administration
                    </div>
                    <Link
                        href="/dashboard/staff"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/staff') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-user-cog w-5 text-center mr-2.5"></i>
                        Staff Management
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/settings') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-cogs w-5 text-center mr-2.5"></i>
                        System Settings
                    </Link>
                    <Link
                        href="/dashboard/branding"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/branding') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-palette w-5 text-center mr-2.5"></i>
                        Branding
                    </Link>
                    <Link
                        href="/dashboard/integrations"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/integrations') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-plug w-5 text-center mr-2.5"></i>
                        Integrations
                    </Link>
                </div>
                <div className="mb-4">
                    <div className="px-5 text-xs uppercase text-gray-500 font-semibold">
                        Support
                    </div>
                    <Link
                        href="/dashboard/support"
                        className={cn(
                            'flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors',
                            pathname.startsWith('/dashboard/support') &&
                                'bg-blue-50 text-primary border-l-4 border-primary font-semibold transition-colors rounded-md',
                        )}
                    >
                        <i className="fas fa-question-circle w-5 text-center mr-2.5"></i>
                        Help & Support
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
