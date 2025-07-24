import { Client } from '@workspace/database/dist/schema';
import { ClipboardList, Edit, Mail, User } from 'lucide-react';
import React from 'react';
import { getBusinessBadgeColor, getBusinessIcon } from './client-content';
import { ListOfBusiness } from '@/services/hmrc';

type Props = {
    client: Client;
    businesses: ListOfBusiness[];
};

export default function ClientHeader({ client, businesses }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {client.firstName} {client.lastName}
                        </h1>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-500">
                                {client.clientType}
                            </span>
                            {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Critical Issues
                            </span> */}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {businesses.map((business) => (
                                <span
                                    key={business.businessId}
                                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBusinessBadgeColor(business.typeOfBusiness)}`}
                                >
                                    {getBusinessIcon(business.typeOfBusiness)}
                                    <span className="ml-1">
                                        {business.typeOfBusiness}
                                    </span>
                                </span>
                            ))}
                            {/* <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBusinessBadgeColor('self-employed')}`}
                            >
                                {getBusinessIcon('self-employed')}
                                <span className="ml-1">
                                    {client.clientType}
                                </span>
                            </span> */}
                            {/* <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBusinessBadgeColor('property')}`}
                            >
                                {getBusinessIcon('property')}
                                <span className="ml-1">Property Rental</span>
                            </span>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBusinessBadgeColor('foreign')}`}
                            >
                                {getBusinessIcon('foreign')}
                                <span className="ml-1">Foreign Income</span>
                            </span> */}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Client
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        MTD Submission
                    </button>
                </div>
            </div>
        </div>
    );
}
