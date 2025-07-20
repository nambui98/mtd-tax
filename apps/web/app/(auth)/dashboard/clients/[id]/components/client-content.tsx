'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    User,
    Mail,
    Edit,
    ClipboardList,
    Info,
    FileText,
    PoundSterling,
    ArrowLeftRight,
    History,
    Globe,
    Briefcase,
    Home,
    Globe2,
    Coins,
    Receipt,
    TrendingUp,
    Scale,
    ExternalLink,
    ChevronRight,
    Upload,
    Download,
    Eye,
    Calendar,
    Tag,
    ArrowDown,
    ArrowUp,
    Check,
    Clock,
    AlertTriangle,
    Bell,
    AlertCircle,
} from 'lucide-react';
import { clientsService } from '@/services/clients';
import { hmrcService } from '@/services/hmrc';
import { useSession } from 'next-auth/react';
import ClientHeader from './client-header';
import ClientTabNav from './client-tab-nav';

export const getInvitationStatusBadge = (status?: string) => {
    switch (status) {
        case 'Accepted':
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Authorized
                </span>
            );
        case 'Pending':
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                </span>
            );
        case 'Rejected':
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Rejected
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Not Requested
                </span>
            );
    }
};

export const getBusinessBadgeColor = (businessType: string) => {
    switch (businessType) {
        case 'self-employed':
            return 'bg-blue-100 text-blue-800';
        case 'property':
            return 'bg-cyan-100 text-cyan-800';
        case 'foreign':
            return 'bg-pink-100 text-pink-800';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

export const getBusinessIcon = (businessType: string) => {
    switch (businessType) {
        case 'self-employed':
            return <Briefcase className="w-3 h-3" />;
        case 'property':
            return <Home className="w-3 h-3" />;
        case 'foreign':
            return <Globe2 className="w-3 h-3" />;
        default:
            return <Briefcase className="w-3 h-3" />;
    }
};

type Props = {
    clientId: string;
};

export default function ClientContent({ clientId }: Props) {
    const params = useParams();
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('financials');
    const [activeBusiness, setActiveBusiness] = useState('consulting');

    const { data: client, isLoading: isLoadingClient } = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => clientsService.getClientById(clientId),
        enabled: !!clientId,
    });

    const { data: invitations, isLoading: isLoadingInvitations } = useQuery({
        queryKey: ['invitations', session?.user?.agentReferenceNumber],
        queryFn: () =>
            hmrcService.getInvitations(
                session?.user?.agentReferenceNumber as string,
            ),
        enabled: !!session?.user?.agentReferenceNumber,
    });

    const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['transactions', params.id],
        queryFn: () =>
            clientsService.getClientTransactions(params.id as string),
        enabled: !!params.id,
    });

    const { data: documents, isLoading: isLoadingDocuments } = useQuery({
        queryKey: ['documents', params.id],
        queryFn: () => clientsService.getClientDocuments(params.id as string),
        enabled: !!params.id,
    });

    const { data: hmrcBusinesses, isLoading: isLoadingHmrcBusinesses } =
        useQuery({
            queryKey: ['hmrc-businesses', client?.utr],
            queryFn: () =>
                hmrcService.getClientBusinesses(
                    client?.nino as string,
                    'ni',
                    client?.postcode as string,
                ),
            enabled: !!client?.nino && !!client?.id,
        });

    if (isLoadingClient) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Client not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ClientHeader
                client={client}
                businesses={hmrcBusinesses?.businesses.listOfBusinesses || []}
            />

            {/* Tabs Navigation */}
            <ClientTabNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeBusiness={activeBusiness}
                setActiveBusiness={setActiveBusiness}
                businesses={hmrcBusinesses?.businesses.listOfBusinesses || []}
            />

            {/* Content based on active tab */}
            {activeTab === 'financials' && (
                <div className="space-y-6">
                    {/* Consulting Business Overview Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Consulting Business Overview
                                </h2>
                                <button className="text-primary hover:text-primary-dark">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        £120,000
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <Coins className="w-3 h-3 mr-1" />
                                        Annual Revenue
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        £26,700
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <Receipt className="w-3 h-3 mr-1" />
                                        YTD Expenses
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        £93,300
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Net Profit
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        £18,660
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <Scale className="w-3 h-3 mr-1" />
                                        Estimated Tax
                                    </div>
                                </div>
                            </div>

                            {/* Business Details */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Business Details
                                    </h3>
                                    <button className="text-primary hover:text-primary-dark text-sm">
                                        Edit{' '}
                                        <Edit className="w-3 h-3 inline ml-1" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Business Type
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Self-Employed
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Start Date
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            15 Mar 2022
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Business Description
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            IT Consulting Services
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Documentation Status
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            85% Complete
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: '85%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Issues Requiring Attention */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Issues Requiring Attention
                                </h3>
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center">
                                            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                Missing May expense receipts
                                            </span>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                                            Open
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Several expense receipts for May 2026
                                        are missing from the Consulting
                                        business.
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Created 5 days ago</span>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-1">
                                                SJ
                                            </div>
                                            Sarah Johnson
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Transactions
                                </h2>
                                <button className="text-primary hover:text-primary-dark text-sm">
                                    View All{' '}
                                    <ChevronRight className="w-3 h-3 inline ml-1" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {isLoadingTransactions ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* {transactions
                                        ?.slice(0, 4)
                                        .map((transaction, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 ${
                                                        transaction.type ===
                                                        'income'
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-red-100 text-red-600'
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    'income' ? (
                                                        <ArrowDown className="w-4 h-4" />
                                                    ) : (
                                                        <ArrowUp className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {
                                                            transaction.description
                                                        }
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {transaction.date}
                                                        <Tag className="w-3 h-3 ml-3 mr-1" />
                                                        {transaction.category}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`text-sm font-semibold ${
                                                        transaction.type ===
                                                        'income'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    'income'
                                                        ? '+'
                                                        : '-'}
                                                    £
                                                    {transaction.amount.toLocaleString()}
                                                </div>
                                            </div>
                                        ))} */}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grid Layout for Additional Content */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Quarterly Submissions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Quarterly Submissions
                                    </h2>
                                    <button className="text-primary hover:text-primary-dark text-sm">
                                        View All{' '}
                                        <ChevronRight className="w-3 h-3 inline ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                                            <div className="text-xs text-gray-500">
                                                5 Apr 2026
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                End of Tax Year
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Tax year 2025-2026 completed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Clock className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                            <div className="text-xs text-gray-500">
                                                7 Aug 2026
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                Q1 Submission Due
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Quarter 1 (Apr-Jun) update for
                                                Consulting Business
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <AlertTriangle className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                                            <div className="text-xs text-gray-500">
                                                7 Nov 2026
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                Q2 Submission Due
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Quarter 2 (Jul-Sep) update for
                                                Consulting Business
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Consulting Business Documents
                                    </h2>
                                    <button className="text-primary hover:text-primary-dark text-sm">
                                        Upload{' '}
                                        <Upload className="w-3 h-3 inline ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {isLoadingDocuments ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* {documents
                                            ?.slice(0, 4)
                                            .map((document, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {document.name}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {
                                                                document.uploadDate
                                                            }
                                                            <User className="w-3 h-3 ml-3 mr-1" />
                                                            {
                                                                document.uploadedBy
                                                            }
                                                            <Check className="w-3 h-3 ml-3 mr-1" />
                                                            {document.status}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                                            <Download className="w-3 h-3 text-gray-500" />
                                                        </button>
                                                        <button className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                                            <Eye className="w-3 h-3 text-gray-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))} */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Consulting Business Financial Summary
                                </h2>
                                <button className="text-primary hover:text-primary-dark text-sm">
                                    Detailed View{' '}
                                    <ChevronRight className="w-3 h-3 inline ml-1" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xl font-semibold text-gray-900">
                                        £120,000
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Annual Revenue
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xl font-semibold text-gray-900">
                                        £26,700
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Total Expenses
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xl font-semibold text-gray-900">
                                        £93,300
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Net Profit
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-xl font-semibold text-gray-900">
                                        £18,660
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Estimated Tax
                                    </div>
                                </div>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                            Category
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                            Current Year
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                            Previous Year
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            Sales / Services
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                                            £120,000
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                                            £105,000
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            Office Expenses
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £15,200
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £12,500
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            Travel & Transport
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £8,500
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £7,200
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            Software Subscriptions
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £3,000
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                            £2,800
                                        </td>
                                    </tr>
                                    <tr className="border-t-2 border-gray-200">
                                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                            Net Profit
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                                            £93,300
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                                            £82,500
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                Consulting Business Revenue & Expense Chart
                                (Q1-Q4)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Authorization Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    HMRC Authorization Status
                </h3>
                <div className="flex items-center space-x-4">
                    {getInvitationStatusBadge(
                        invitations?.invitations?.find(
                            (invitation: any) =>
                                invitation.invitationId ===
                                client?.invitationId,
                        )?.status,
                    )}
                    <span className="text-sm text-gray-600">
                        Last checked: {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* HMRC Businesses */}
            {hmrcBusinesses &&
                hmrcBusinesses.businesses.listOfBusinesses.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            HMRC Businesses
                        </h3>
                        {isLoadingHmrcBusinesses ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {hmrcBusinesses.businesses.listOfBusinesses.map(
                                    (business, index) => (
                                        <div
                                            key={business.businessId}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        {
                                                            business.typeOfBusiness
                                                        }
                                                    </h4>
                                                    {business.tradingName && (
                                                        <p className="text-sm text-gray-600">
                                                            Trading as:{' '}
                                                            {
                                                                business.tradingName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {business.typeOfBusiness}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">
                                                        Business ID:
                                                    </span>
                                                    <span className="ml-2 text-gray-600">
                                                        {business.businessId}
                                                    </span>
                                                </div>
                                                {/* <div>
                                                    <span className="font-medium text-gray-700">
                                                        Accounting Type:
                                                    </span>
                                                    <span className="ml-2 text-gray-600">
                                                        {
                                                            business.accountingType
                                                        }
                                                    </span>
                                                </div> */}
                                                <div>
                                                    <span className="font-medium text-gray-700">
                                                        Commencement:
                                                    </span>
                                                    <span className="ml-2 text-gray-600">
                                                        {/* {new Date(
                                                            business.commencementDate,
                                                        ).toLocaleDateString()} */}
                                                    </span>
                                                </div>
                                                {/* {business.cessationDate && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            Cessation:
                                                        </span>
                                                        <span className="ml-2 text-gray-600">
                                                            {new Date(
                                                                business.cessationDate,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* {business.address && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <span className="font-medium text-gray-700">
                                                        Address:
                                                    </span>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        <div>
                                                            {
                                                                business.address
                                                                    .line1
                                                            }
                                                        </div>
                                                        {business.address
                                                            .line2 && (
                                                            <div>
                                                                {
                                                                    business
                                                                        .address
                                                                        .line2
                                                                }
                                                            </div>
                                                        )}
                                                        {business.address
                                                            .line3 && (
                                                            <div>
                                                                {
                                                                    business
                                                                        .address
                                                                        .line3
                                                                }
                                                            </div>
                                                        )}
                                                        {business.address
                                                            .line4 && (
                                                            <div>
                                                                {
                                                                    business
                                                                        .address
                                                                        .line4
                                                                }
                                                            </div>
                                                        )}
                                                        <div>
                                                            {
                                                                business.address
                                                                    .postcode
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* {business.accountingPeriod && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <span className="font-medium text-gray-700">
                                                        Accounting Period:
                                                    </span>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        {new Date(
                                                            business.accountingPeriod.startDate,
                                                        ).toLocaleDateString()}{' '}
                                                        -{' '}
                                                        {new Date(
                                                            business.accountingPeriod.endDate,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* {business.businessDescription && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <span className="font-medium text-gray-700">
                                                        Description:
                                                    </span>
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        {
                                                            business.businessDescription
                                                        }
                                                    </div>
                                                </div>
                                            )} */}
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}
