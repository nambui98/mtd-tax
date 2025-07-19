'use client';
import {
    AlertCircle,
    AlertTriangle,
    ArrowUp,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    FileText,
} from 'lucide-react';
import {
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Plus,
} from 'lucide-react';
import React from 'react';
import SubmissionsFilter from './submissions-filter';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

type Props = {};

export default function SubmissionsContent({}: Props) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-lg shadow p-5 relative">
                    <div className="absolute top-3 right-3 text-gray-300 text-xl">
                        <FileText />
                    </div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                        347
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Submissions
                    </div>
                    <div className="flex items-center text-sm mt-2">
                        <ArrowUp className="text-green-500 mr-1" />
                        <span className="text-green-500 mr-1">12%</span>
                        <span className="text-gray-400">vs. last year</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-5 relative">
                    <div className="absolute top-3 right-3 text-gray-300 text-xl">
                        <CheckCircle className="text-green-500 mr-1" />
                    </div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                        289
                    </div>
                    <div className="text-sm text-gray-500">
                        Submitted Successfully
                    </div>
                    <div className="flex items-center text-sm mt-2">
                        <ArrowUp className="text-green-500 mr-1" />
                        <span className="text-green-500 mr-1">8%</span>
                        <span className="text-gray-400">vs. last year</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-5 relative">
                    <div className="absolute top-3 right-3 text-gray-300 text-xl">
                        <Clock className="text-green-500 mr-1" />
                    </div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                        42
                    </div>
                    <div className="text-sm text-gray-500">
                        Pending Submissions
                    </div>
                    <div className="flex items-center text-sm mt-2">
                        <ArrowDown className="text-red-500 mr-1" />
                        <span className="text-red-500 mr-1">5%</span>
                        <span className="text-gray-400">vs. last quarter</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-5 relative">
                    <div className="absolute top-3 right-3 text-gray-300 text-xl">
                        <AlertTriangle className="text-red-500 mr-1" />
                    </div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                        16
                    </div>
                    <div className="text-sm text-gray-500">Action Required</div>
                    <div className="flex items-center text-sm mt-2">
                        <ArrowUp className="text-green-500 mr-1" />
                        <span className="text-green-500 mr-1">10%</span>
                        <span className="text-gray-400">improvement</span>
                    </div>
                </div>
            </div>

            <SubmissionsFilter onFilter={() => {}} />

            <div className="bg-white rounded-lg shadow p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Submissions
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            size="lg"
                            variant={'outline'}
                            className="text-base"
                        >
                            <Download className="mr-1" /> Export
                        </Button>
                        <Button
                            size="lg"
                            variant={'default'}
                            asChild
                            className="text-base"
                        >
                            <Link href="/dashboard/submissions/add">
                                <Plus className="mr-1" /> New Submission
                            </Link>
                        </Button>
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b">
                            <th className="py-3 px-4">Client / Business</th>
                            <th className="py-3 px-4">Submission Type</th>
                            <th className="py-3 px-4">Period</th>
                            <th className="py-3 px-4">Due Date</th>
                            <th className="py-3 px-4">Submission Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Assigned To</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Smith Consulting Ltd
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Web Development Business
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q1 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Apr - Jun 2026</td>
                            <td className="py-3 px-4">7 Aug 2026</td>
                            <td className="py-3 px-4">—</td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    In Progress
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                                        SJ
                                    </div>
                                    Sarah Johnson
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Clock className="mr-1" /> Prepare
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Taylor Freelance
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Graphic Design Services
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Annual Declaration
                                </span>
                            </td>
                            <td className="py-3 px-4">2025-2026</td>
                            <td className="py-3 px-4">31 Jan 2027</td>
                            <td className="py-3 px-4">15 Jan 2027</td>
                            <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Submitted
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center mr-2">
                                        JW
                                    </div>
                                    James Wilson
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Eye className="mr-1" /> View
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Green Properties
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Property Rental Business
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q4 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Jan - Mar 2026</td>
                            <td className="py-3 px-4">7 May 2026</td>
                            <td className="py-3 px-4">5 May 2026</td>
                            <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Submitted
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center mr-2">
                                        MT
                                    </div>
                                    Mike Thomas
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Eye className="mr-1" /> View
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Horizon Design
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Interior Design Services
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q4 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Jan - Mar 2026</td>
                            <td className="py-3 px-4">7 May 2026</td>
                            <td className="py-3 px-4">2 May 2026</td>
                            <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Submitted
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center mr-2">
                                        EP
                                    </div>
                                    Emma Parker
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Eye className="mr-1" /> View
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Apex Solutions
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        IT Consulting Services
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Annual Declaration
                                </span>
                            </td>
                            <td className="py-3 px-4">2025-2026</td>
                            <td className="py-3 px-4">31 Jan 2027</td>
                            <td className="py-3 px-4">—</td>
                            <td className="py-3 px-4">
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Draft
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                                        SJ
                                    </div>
                                    Sarah Johnson
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Edit className="mr-1" /> Edit
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Johnson Electronics
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Electronics Retailer
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q2 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Jul - Sep 2026</td>
                            <td className="py-3 px-4">7 Nov 2026</td>
                            <td className="py-3 px-4">29 Oct 2026</td>
                            <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Submitted
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center mr-2">
                                        LM
                                    </div>
                                    Laura Mitchell
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Eye className="mr-1" /> View
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Green Properties
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Commercial Properties
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q2 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Jul - Sep 2026</td>
                            <td className="py-3 px-4">7 Nov 2026</td>
                            <td className="py-3 px-4">—</td>
                            <td className="py-3 px-4">
                                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Rejected
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center mr-2">
                                        MT
                                    </div>
                                    Mike Thomas
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <AlertCircle className="mr-1" />
                                    Resolve
                                </a>
                            </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <div className="font-medium text-gray-900">
                                        Carter Plumbing
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Plumbing Services
                                    </span>
                                </a>
                            </td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Q3 Update
                                </span>
                            </td>
                            <td className="py-3 px-4">Oct - Dec 2026</td>
                            <td className="py-3 px-4">7 Feb 2027</td>
                            <td className="py-3 px-4">—</td>
                            <td className="py-3 px-4">
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                    Pending
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center mr-2">
                                        JW
                                    </div>
                                    James Wilson
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <a
                                    href="submission-detail-page.html"
                                    className="text-blue-600 hover:underline"
                                >
                                    <Clock className="mr-1" /> Prepare
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                        Showing 1-15 of 347 submissions
                    </div>
                    <div className="flex gap-1">
                        <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100"
                            disabled
                        >
                            <ChevronLeft className="mr-1" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-blue-600 text-white rounded">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100">
                            3
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100">
                            4
                        </button>
                        <span className="flex items-center justify-center text-gray-500">
                            ...
                        </span>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100">
                            23
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white rounded hover:bg-gray-100">
                            <ChevronRight className="mr-1" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Upcoming Submission Deadlines
                        </h2>
                        <a href="#" className="text-blue-600 hover:underline">
                            View All
                        </a>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b">
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Submission Type</th>
                                <th className="py-3 px-4">Deadline</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    Smith Consulting Ltd
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Q1 Update
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-red-600 font-medium">
                                    7 Aug 2026
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">Green Properties</td>
                                <td className="py-3 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Q1 Update
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-red-600 font-medium">
                                    7 Aug 2026
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        In Progress
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">Horizon Design</td>
                                <td className="py-3 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Q1 Update
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-yellow-600 font-medium">
                                    7 Aug 2026
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Error
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">Taylor Freelance</td>
                                <td className="py-3 px-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Q1 Update
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-yellow-600 font-medium">
                                    7 Aug 2026
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        Submitted
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Submission Issues
                        </h2>
                        <a href="#" className="text-blue-600 hover:underline">
                            View All
                        </a>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        <li className="flex items-center py-3">
                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                                <AlertCircle className="mr-1" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Horizon Design - Q1 Update
                                </div>
                                <div className="text-sm text-gray-500">
                                    HMRC validation failed: Missing property
                                    income details
                                </div>
                            </div>
                            <div className="text-red-600">
                                <AlertCircle className="mr-1" />
                            </div>
                        </li>
                        <li className="flex items-center py-3">
                            <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3">
                                <AlertTriangle className="mr-1" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Green Properties - Q2 Update
                                </div>
                                <div className="text-sm text-gray-500">
                                    Rejected by HMRC: Expense categorization
                                    mismatch
                                </div>
                            </div>
                            <div className="text-yellow-600">
                                <AlertTriangle className="mr-1" />
                            </div>
                        </li>
                        <li className="flex items-center py-3">
                            <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3">
                                <AlertTriangle className="mr-1" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Smith Consulting Ltd - Annual Declaration
                                </div>
                                <div className="text-sm text-gray-500">
                                    Missing supporting documentation for tax
                                    relief claims
                                </div>
                            </div>
                            <div className="text-yellow-600">
                                <AlertTriangle className="mr-1" />
                            </div>
                        </li>
                        <li className="flex items-center py-3">
                            <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3">
                                <AlertTriangle className="mr-1" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Johnson Electronics - Q3 Update
                                </div>
                                <div className="text-sm text-gray-500">
                                    Data consistency check failed: Q1 + Q2 + Q3
                                    totals mismatch
                                </div>
                            </div>
                            <div className="text-yellow-600">
                                <AlertTriangle className="mr-1" />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
