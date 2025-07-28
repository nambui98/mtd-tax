import { ArrowLeftRight, Briefcase, Globe, Info, History } from 'lucide-react';
import { FileText, Globe2 } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { PoundSterling } from 'lucide-react';
import { Home } from 'lucide-react';
import React from 'react';
import { ListOfBusiness } from '@/services/hmrc';
import {
    getBusinessBadgeColor,
    getBusinessIcon,
    getBusinessName,
} from './client-content';

type Props = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    activeBusiness: string;
    setActiveBusiness: (business: string) => void;
    businesses: ListOfBusiness[];
};

export default function ClientTabNav({
    activeTab,
    setActiveTab,
    activeBusiness,
    setActiveBusiness,
    businesses,
}: Props) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
                {businesses.map((business) => (
                    <button
                        key={business.businessId}
                        onClick={() => setActiveBusiness(business.businessId)}
                        className={`px-6 py-3 text-sm font-medium relative transition-colors flex items-center ${
                            activeBusiness === business.businessId
                                ? 'text-primary bg-gray-50'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {getBusinessIcon(business.typeOfBusiness)}
                        <span className="ml-2">
                            {business.tradingName ||
                                getBusinessName(business.typeOfBusiness)}
                        </span>
                        <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded ${getBusinessBadgeColor(
                                business.typeOfBusiness,
                            )}`}
                        >
                            {getBusinessName(business.typeOfBusiness)}
                        </span>
                        {activeBusiness === business.businessId && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                        )}
                    </button>
                ))}
                {/* <button
                    onClick={() => setActiveBusiness('consulting')}
                    className={`px-6 py-3 text-sm font-medium relative transition-colors ${
                        activeBusiness === 'consulting'
                            ? 'text-primary bg-gray-50'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Consulting
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        Self-Employed
                    </span>
                    {activeBusiness === 'consulting' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveBusiness('property')}
                    className={`px-6 py-3 text-sm font-medium relative transition-colors ${
                        activeBusiness === 'property'
                            ? 'text-primary bg-gray-50'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Home className="w-4 h-4 inline mr-2" />
                    Property Rental
                    <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-100 text-cyan-800 rounded">
                        Property
                    </span>
                    {activeBusiness === 'property' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveBusiness('foreign')}
                    className={`px-6 py-3 text-sm font-medium relative transition-colors ${
                        activeBusiness === 'foreign'
                            ? 'text-primary bg-gray-50'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Globe2 className="w-4 h-4 inline mr-2" />
                    Foreign Income
                    <span className="ml-2 px-2 py-0.5 text-xs bg-pink-100 text-pink-800 rounded">
                        Foreign
                    </span>
                    {activeBusiness === 'foreign' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button> */}
            </div>
            <div className="flex border-b border-gray-200">
                {/* <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'overview'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Info className="w-4 h-4 inline mr-2" />
                    Overview
                </button> */}
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'documents'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Documents
                </button>
                {/* <button
                    onClick={() => setActiveTab('submissions')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'submissions'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <ClipboardList className="w-4 h-4 inline mr-2" />
                    Submissions
                </button> */}
                {/* <button
                    onClick={() => setActiveTab('financials')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'financials'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <PoundSterling className="w-4 h-4 inline mr-2" />
                    Financials
                </button> */}
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'transactions'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <ArrowLeftRight className="w-4 h-4 inline mr-2" />
                    Transactions
                </button>
                {/* <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'activity'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <History className="w-4 h-4 inline mr-2" />
                    Activity
                </button> */}
            </div>

            {/* Business Tabs (Secondary Navigation) */}
        </div>
    );
}
