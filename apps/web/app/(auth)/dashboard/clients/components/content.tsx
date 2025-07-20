'use client';
import {
    Building,
    CheckIcon,
    ChevronRightIcon,
    CircleAlertIcon,
    ClockIcon,
    Loader2,
    TriangleAlertIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import Filter from './filter';
import { clientsService } from '@/services/clients';
import { useQuery } from '@tanstack/react-query';
import { hmrcService } from '@/services/hmrc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {};

export default function ClientsContent({}: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [filters, setFilters] = useState<{
        search?: string;
        businessType?: string;
        assignee?: string;
    }>({});

    const { data: clients, isLoading } = useQuery({
        queryKey: ['clients', filters],
        queryFn: () => clientsService.getMyClients(filters),
    });

    const { data: invitations, isLoading: isLoadingInvitations } = useQuery({
        queryKey: ['invitations', session?.user.agentReferenceNumber],
        queryFn: () =>
            hmrcService.getInvitations(
                session?.user.agentReferenceNumber as string,
            ),
    });
    console.log('====================================');
    console.log(clients);
    console.log('====================================');

    // Calculate statistics based on invitation status
    // const stats = React.useMemo(() => {
    //     if (!clients)
    //         return {
    //             mtdReady: 0,
    //             actionNeeded: 0,
    //             criticalIssues: 0,
    //             upcomingDeadlines: 0,
    //         };

    //     return {
    //         mtdReady: clients.filter(
    //             (c) => c.invitationStatus?.invitationStatus === 'accepted',
    //         ).length,
    //         actionNeeded: clients.filter(
    //             (c) => c.invitationStatus?.invitationStatus === 'pending',
    //         ).length,
    //         criticalIssues: clients.filter(
    //             (c) => c.invitationStatus?.invitationStatus === 'rejected',
    //         ).length,
    //         upcomingDeadlines: clients.filter(
    //             (c) =>
    //                 !c.invitationStatus ||
    //                 c.invitationStatus.invitationStatus === 'not_requested',
    //         ).length,
    //     };
    // }, [clients]);

    const getInvitationStatusBadge = (status?: string) => {
        switch (status) {
            case 'Accepted':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-success-light text-success">
                        Authorized
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-warning-light text-warning">
                        Pending
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-danger-light text-danger">
                        Rejected
                    </span>
                );
            case 'Not Requested':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-gray-100 text-gray-600">
                        Not Requested
                    </span>
                );
            case 'Error':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-gray-100 text-gray-600">
                        Error
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-gray-100 text-gray-600">
                        Unknown
                    </span>
                );
        }
    };

    return (
        <>
            {/* Client Groups */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-success-light text-success flex items-center justify-center mr-3">
                        <CheckIcon className="size-6" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">
                            97
                        </div>
                        <div className="text-[0.875rem] text-gray-500">
                            MTD Ready
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="text-[0.75rem] text-primary flex items-center"
                    >
                        View
                        <ChevronRightIcon className="size-6 ml-1" />
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-warning-light text-warning flex items-center justify-center mr-3">
                        <TriangleAlertIcon className="size-6" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">
                            24
                        </div>
                        <div className="text-[0.875rem] text-gray-500">
                            Action Needed
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="text-[0.75rem] text-primary flex items-center"
                    >
                        View
                        <ChevronRightIcon className="size-6 ml-1" />
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-danger-light text-danger flex items-center justify-center mr-3">
                        <CircleAlertIcon className="size-6" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">
                            7
                        </div>
                        <div className="text-[0.875rem] text-gray-500">
                            Critical Issues
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="text-[0.75rem] text-primary flex items-center"
                    >
                        View
                        <ChevronRightIcon className="size-6 ml-1" />
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-light text-primary-dark flex items-center justify-center mr-3">
                        <ClockIcon className="size-6" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-900">
                            42
                        </div>
                        <div className="text-[0.875rem] text-gray-500">
                            Upcoming Deadlines
                        </div>
                    </div>
                    <Link
                        href="#"
                        className="text-[0.75rem] text-primary flex items-center"
                    >
                        View
                        <ChevronRightIcon className="size-6 ml-1" />
                    </Link>
                </div>
            </div>

            {/* Control Panel */}
            <div className="bg-white rounded-t-lg shadow-sm">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 px-4">
                    <div className="px-4 py-3 text-[0.875rem] font-medium text-primary border-b-2 border-primary">
                        All Clients
                    </div>
                    <div className="px-4 py-3 text-[0.875rem] font-medium text-gray-600 hover:text-primary cursor-pointer">
                        Self-Employed
                    </div>
                    <div className="px-4 py-3 text-[0.875rem] font-medium text-gray-600 hover:text-primary cursor-pointer">
                        Property
                    </div>
                    <div className="px-4 py-3 text-[0.875rem] font-medium text-gray-600 hover:text-primary cursor-pointer">
                        Multiple Businesses
                    </div>
                </div>

                {/* Search and Filter */}
                <Filter
                    onFilter={(filters) => {
                        setFilters(filters);
                    }}
                />

                {/* Clients Table */}
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Client
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Businesses
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Authorization Status
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Accountant
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Next Deadline
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase">
                                Total Revenue
                            </th>
                            <th className="px-4 py-3 text-left text-[0.75rem] font-semibold text-gray-500 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    <Loader2 className="size-4 animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : clients && clients.length > 0 ? (
                            clients?.map((client) => (
                                <tr
                                    className="hover:bg-gray-50"
                                    key={client.id}
                                    onClick={() => {
                                        router.push(
                                            `/dashboard/clients/${client.id}`,
                                        );
                                    }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                                <Building className="size-4" />
                                            </div>
                                            <div>
                                                <a
                                                    href="client-detail-page.html"
                                                    className="font-medium text-gray-900"
                                                >
                                                    {client.firstName}{' '}
                                                    {client.lastName}
                                                </a>
                                                <div className="text-[0.75rem] text-gray-500">
                                                    {client.clientType}
                                                </div>
                                                <div className="flex gap-1 mt-0.5">
                                                    <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center">
                                                        {client.clientType}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[0.875rem]">
                                        --
                                    </td>
                                    <td className="px-4 py-3">--</td>
                                    <td className="px-4 py-3">
                                        {/* <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-danger-light text-danger">
                                        Critical Issues
                                    </span> */}
                                        {isLoadingInvitations ? (
                                            <Loader2 className="size-4 animate-spin mx-auto" />
                                        ) : (
                                            getInvitationStatusBadge(
                                                invitations?.invitations?.find(
                                                    (invitation) =>
                                                        invitation.invitationId ===
                                                        client?.invitationId,
                                                )?.status,
                                            )
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="uppercase w-6 h-6 rounded-full bg-blue-500 text-white text-[0.75rem] flex items-center justify-center mr-1.5">
                                                {client.assignee?.firstName?.charAt(
                                                    0,
                                                )}
                                                {client.assignee?.lastName?.charAt(
                                                    0,
                                                )}
                                            </div>
                                            <div className="text-[0.875rem] text-gray-600">
                                                {client.assignee?.firstName}{' '}
                                                {client.assignee?.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="font-medium text-danger mr-1.5">
                                                --
                                            </div>
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                                --
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 relative group">
                                        {client.totalRevenue}
                                        <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-2.5 w-60 hidden group-hover:block z-50">
                                            <div className="text-[0.75rem] font-semibold text-gray-700 mb-1.5">
                                                Business Revenue Breakdown
                                            </div>
                                            <div className="flex justify-between text-[0.75rem] mb-1">
                                                <div className="text-gray-500">
                                                    UK Properties
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    £68,000
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-[0.75rem]">
                                                <div className="text-gray-500">
                                                    Holiday Lets
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    £27,000
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="p-1 text-gray-600 hover:bg-gray-100 hover:text-primary rounded">
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    No clients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {/* <div className="flex justify-between items-center px-4 py-2.5 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="text-[0.875rem] text-gray-500">
                        Showing 1-5 of 128 clients
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400"
                            disabled
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white border border-primary">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                            3
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                            4
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                            5
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div> */}
            </div>
        </>
    );
}
