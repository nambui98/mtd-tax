'use client';
import MainPageWrapper from '@/components/layout/main-page-wrapper';
import {
    Building,
    CheckIcon,
    ChevronRightIcon,
    CircleAlertIcon,
    ClockIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import Filter from './filter';
import { clientsService } from '@/services/clients';
import { useQuery } from '@tanstack/react-query';

type Props = {};

export default function ClientsContent({}: Props) {
    const [filters, setFilters] = useState<{
        search?: string;
        businessType?: string;
        assignee?: string;
    }>({});
    const { data: clients } = useQuery({
        queryKey: ['clients', filters],
        queryFn: () => clientsService.getMyClients(filters),
    });
    console.log(clients);

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
                        {/* Client Row 1 */}
                        {clients?.map((client) => (
                            <tr className="hover:bg-gray-50" key={client.id}>
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
                                                {/* {client.title}{' '} */}
                                                {client.firstName}{' '}
                                                {client.lastName}
                                            </a>
                                            <div className="text-[0.75rem] text-gray-500">
                                                {client.clientType}
                                            </div>
                                            <div className="flex gap-1 mt-0.5">
                                                <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center">
                                                    {/* <i className="fas fa-store text-[0.75rem] mr-1"></i>{' '} */}
                                                    {client.clientType}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[0.875rem]">
                                    {/* {client.businesses.length} */}
                                    --
                                </td>
                                <td className="px-4 py-3">
                                    {/* <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-danger-light text-danger">
                                        Critical Issues
                                    </span> */}
                                    --
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <div className="uppercase w-6 h-6 rounded-full bg-blue-500 text-white text-[0.75rem] flex items-center justify-center mr-1.5">
                                            {client.assignee.firstName.charAt(
                                                0,
                                            )}
                                            {client.assignee.lastName.charAt(0)}
                                        </div>
                                        <div className="text-[0.875rem] text-gray-600">
                                            {client.assignee.firstName}{' '}
                                            {client.assignee.lastName}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <div className="font-medium text-danger mr-1.5">
                                            {/* {client.deadline} */}
                                            --
                                        </div>
                                        <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                            {/* {client.deadline} */}
                                            --
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 relative group">
                                    {/* £175,000 */}
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
                        ))}

                        {/* <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            Emma Taylor
                                        </div>
                                        <div className="text-[0.75rem] text-gray-500">
                                            Self-Employed
                                        </div>
                                        <div className="flex gap-1 mt-0.5">
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-primary-light text-primary-dark flex items-center">
                                                <i className="fas fa-laptop text-[0.75rem] mr-1"></i>{' '}
                                                Freelance
                                            </div>
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-primary-light text-primary-dark flex items-center">
                                                <i className="fas fa-store text-[0.75rem] mr-1"></i>{' '}
                                                Shop
                                                <span className="ml-1 px-1 py-0.5 rounded bg-primary-light text-primary-dark text-[0.65rem]">
                                                    NEW
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-[0.875rem]">2</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-warning-light text-warning">
                                    Action Needed
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-green-500 text-white text-[0.75rem] flex items-center justify-center mr-1.5">
                                        JW
                                    </div>
                                    <div className="text-[0.875rem] text-gray-600">
                                        James Wilson
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="font-medium text-warning mr-1.5">
                                        7 Aug 2026
                                    </div>
                                    <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                        Q1
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 relative group">
                                £45,000
                                <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-2.5 w-60 hidden group-hover:block z-50">
                                    <div className="text-[0.75rem] font-semibold text-gray-700 mb-1.5">
                                        Business Revenue Breakdown
                                    </div>
                                    <div className="flex justify-between text-[0.75rem] mb-1">
                                        <div className="text-gray-500">
                                            Freelance Design
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £38,500
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[0.75rem]">
                                        <div className="text-gray-500">
                                            Online Shop
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £6,500
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

                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                        <i className="fas fa-paint-brush"></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            David Jones
                                        </div>
                                        <div className="text-[0.75rem] text-gray-500">
                                            Multiple Businesses
                                        </div>
                                        <div className="flex gap-1 mt-0.5">
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center">
                                                <i className="fas fa-building text-[0.75rem] mr-1"></i>{' '}
                                                Co
                                            </div>
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-primary-light text-primary-dark flex items-center">
                                                <i className="fas fa-coffee text-[0.75rem] mr-1"></i>{' '}
                                                Café
                                            </div>
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 flex items-center">
                                                <i className="fas fa-home text-[0.75rem] mr-1"></i>{' '}
                                                Property
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-[0.875rem]">3</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-success-light text-success">
                                    MTD Ready
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[0.75rem] flex items-center justify-center mr-1.5">
                                        EP
                                    </div>
                                    <div className="text-[0.875rem] text-gray-600">
                                        Emma Parker
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="font-medium text-warning mr-1.5">
                                        7 Aug 2026
                                    </div>
                                    <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                        Q1
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 relative group">
                                £165,000
                                <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-2.5 w-60 hidden group-hover:block z-50">
                                    <div className="text-[0.75rem] font-semibold text-gray-700 mb-1.5">
                                        Business Revenue Breakdown
                                    </div>
                                    <div className="flex justify-between text-[0.75rem] mb-1">
                                        <div className="text-gray-500">
                                            Horizon Design Ltd
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £120,000
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[0.75rem] mb-1">
                                        <div className="text-gray-500">
                                            Café (Self-Employed)
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £35,000
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[0.75rem]">
                                        <div className="text-gray-500">
                                            Property
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £10,000
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

                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                        <i className="fas fa-globe"></i>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            Jennifer Lee
                                        </div>
                                        <div className="text-[0.75rem] text-gray-500">
                                            Self-Employed + Foreign
                                        </div>
                                        <div className="flex gap-1 mt-0.5">
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-primary-light text-primary-dark flex items-center">
                                                <i className="fas fa-laptop text-[0.75rem] mr-1"></i>{' '}
                                                Consulting
                                            </div>
                                            <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 flex items-center">
                                                <i className="fas fa-globe text-[0.75rem] mr-1"></i>{' '}
                                                Foreign
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-[0.875rem]">2</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-success-light text-success">
                                    MTD Ready
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[0.75rem] flex items-center justify-center mr-1.5">
                                        SJ
                                    </div>
                                    <div className="text-[0.875rem] text-gray-600">
                                        Sarah Johnson
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center">
                                    <div className="font-medium text-success mr-1.5">
                                        7 Aug 2026
                                    </div>
                                    <div className="text-[0.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                        Q1
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 relative group">
                                £82,000
                                <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-2.5 w-60 hidden group-hover:block z-50">
                                    <div className="text-[0.75rem] font-semibold text-gray-700 mb-1.5">
                                        Business Revenue Breakdown
                                    </div>
                                    <div className="flex justify-between text-[0.75rem] mb-1">
                                        <div className="text-gray-500">
                                            Consulting (UK)
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            £55,000
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[0.75rem]">
                                        <div className="text-gray-500">
                                            Foreign Property
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
                        </tr> */}
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
