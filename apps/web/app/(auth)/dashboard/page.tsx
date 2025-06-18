'use client';
import { UserNav } from '@/components/user-nav';
import { Button } from '@workspace/ui/components/button';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

type Props = {};

export default function DashboardPage({}: Props) {
    const { data: session } = useSession();
    return (
        <div className="flex min-h-screen">
            {/* <Button onClick={() => signOut()}>Sign Out</Button> */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm z-10">
                <div className="p-5 border-b border-gray-200">
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
                        <a
                            href="agency-admin-dashboard.html"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors bg-blue-50 text-primary border-l-3 border-primary"
                        >
                            <i className="fas fa-chart-line w-5 text-center mr-2.5"></i>
                            Dashboard
                        </a>
                        <a
                            href="agency-clients-page.html"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-users w-5 text-center mr-2.5"></i>
                            Clients
                        </a>
                        <a
                            href="agency-submissions-page.html"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-clipboard-list w-5 text-center mr-2.5"></i>
                            Submissions
                        </a>
                        <a
                            href="documents-page.html"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-folder w-5 text-center mr-2.5"></i>
                            Documents
                        </a>
                    </div>
                    <div className="mb-4">
                        <div className="px-5 text-xs uppercase text-gray-500 font-semibold">
                            Administration
                        </div>
                        <a
                            href="#"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-user-cog w-5 text-center mr-2.5"></i>
                            Staff Management
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-cogs w-5 text-center mr-2.5"></i>
                            System Settings
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-palette w-5 text-center mr-2.5"></i>
                            Branding
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-plug w-5 text-center mr-2.5"></i>
                            Integrations
                        </a>
                    </div>
                    <div className="mb-4">
                        <div className="px-5 text-xs uppercase text-gray-500 font-semibold">
                            Support
                        </div>
                        <a
                            href="#"
                            className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <i className="fas fa-question-circle w-5 text-center mr-2.5"></i>
                            Help & Support
                        </a>
                    </div>
                </nav>
            </aside>

            <div className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Administrator Dashboard
                    </h1>
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
                        {/* <div
                            onClick={() => signOut()}
                            className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold cursor-pointer"
                        >
                            JD
                        </div> */}
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Practice Overview
                                </h2>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        128
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Total Clients
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        97
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        MTD Ready
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        24
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Action Needed
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        7
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Critical Issues
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Upcoming Deadlines
                                </h2>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    View All
                                </a>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                            Client
                                        </th>
                                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                            Submission Type
                                        </th>
                                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                            Deadline
                                        </th>
                                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                            Status
                                        </th>
                                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                            Assigned To
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border-b border-gray-200">
                                            Smith Consulting Ltd
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                Q1 Update
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-red-700 border-b border-gray-200">
                                            7 Aug 2026
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            Sarah Johnson
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border-b border-gray-200">
                                            Green Properties
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                Q1 Update
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-red-700 border-b border-gray-200">
                                            7 Aug 2026
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            Mike Thomas
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border-b border-gray-200">
                                            Taylor Freelance
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                Q1 Update
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-orange-700 border-b border-gray-200">
                                            7 Aug 2026
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                                In Progress
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            James Wilson
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border-b border-gray-200">
                                            Horizon Design
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                Doc Request
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-orange-700 border-b border-gray-200">
                                            15 Jul 2026
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
                                                Complete
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm border-b border-gray-200">
                                            Emma Parker
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Staff Activity
                                </h2>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    View All
                                </a>
                            </div>
                            <ul>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                                        SJ
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Sarah Johnson
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Completed Q1 submission for Apex
                                            Solutions
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 ml-2.5 whitespace-nowrap">
                                        30m ago
                                    </div>
                                </li>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                                        MT
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Mike Thomas
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Reviewed documents from Green
                                            Properties
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 ml-2.5 whitespace-nowrap">
                                        1h ago
                                    </div>
                                </li>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                                        JW
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            James Wilson
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Added 3 new clients to the system
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 ml-2.5 whitespace-nowrap">
                                        2h ago
                                    </div>
                                </li>
                                <li className="flex py-3">
                                    <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                                        EP
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Emma Parker
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Sent document request to Horizon
                                            Design
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 ml-2.5 whitespace-nowrap">
                                        3h ago
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    System Status
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="flex items-center p-2.5 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2.5 flex-shrink-0">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            HMRC API
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Operational
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-2.5 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2.5 flex-shrink-0">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Document Storage
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Operational
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-2.5 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mr-2.5 flex-shrink-0">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Email Service
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Degraded Performance
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-2.5 bg-gray-50 rounded-md border border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2.5 flex-shrink-0">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Database
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Operational
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Resource Allocation
                                </h2>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    Manage
                                </a>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        32
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Sarah Johnson
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        28
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Mike Thomas
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        35
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        James Wilson
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] p-4 bg-gray-50 rounded-md border border-gray-200 mr-2.5 mb-2.5">
                                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                                        29
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Emma Parker
                                    </div>
                                </div>
                            </div>
                            <div className="h-[150px] bg-gray-100 rounded-md mt-4 flex items-center justify-center text-gray-500">
                                Staff Workload Chart
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="bg-white rounded-lg shadow-sm p-5 col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Clients Requiring Attention
                                </h2>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    View All Clients
                                </a>
                            </div>
                            <ul>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-building text-gray-500"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Smith Consulting Ltd
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Missing documentation for Q1
                                            submission
                                        </div>
                                    </div>
                                    <div className="text-red-700">
                                        <i className="fas fa-exclamation-circle"></i>
                                    </div>
                                </li>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-home text-gray-500"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Green Properties
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            5 pending receipt categorizations
                                        </div>
                                    </div>
                                    <div className="text-orange-700">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                </li>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-user text-gray-500"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Taylor Freelance
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            New bank statements need processing
                                        </div>
                                    </div>
                                    <div className="text-orange-700">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                </li>
                                <li className="flex py-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-briefcase text-gray-500"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Apex Solutions
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            HMRC authorization expires in 10
                                            days
                                        </div>
                                    </div>
                                    <div className="text-orange-700">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Administrative Actions
                                </h2>
                            </div>
                            <ul>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Add New Staff Member
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Create user account and assign
                                            clients
                                        </div>
                                    </div>
                                </li>
                                <li className="flex py-3 border-b border-gray-200">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                                        <i className="fas fa-cog"></i>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                                            Configure System Settings
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Manage permissions and preferences
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
