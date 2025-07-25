'use client';
import { clientsService } from '@/services/clients';
import { hmrcService } from '@/services/hmrc';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Globe2, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import ClientFinancials from './client-financials';
import ClientHeader from './client-header';
import ClientTabNav from './client-tab-nav';
import HmrcAuthStatus from './hmrc-auth-status';
import HmrcBusinesses from './hmrc-businesses';
import ClientDocuments from './client-documents';

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
    const [activeTab, setActiveTab] = useState('documents');
    const [activeBusiness, setActiveBusiness] = useState('');

    const { data: client, isLoading: isLoadingClient } = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => clientsService.getClientById(clientId),
        enabled: !!clientId,
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

    const {
        data: clientBusinessDetails,
        isLoading: isLoadingClientBusinessDetails,
    } = useQuery({
        queryKey: ['client-business-details', client?.utr],
        queryFn: () =>
            hmrcService.getClientBusinessDetails(
                clientId,
                activeBusiness,
                client?.nino as string,
            ),
        enabled: !!client?.nino && !!client?.id && !!activeBusiness,
    });
    console.log(clientBusinessDetails);
    console.log(hmrcBusinesses);

    useEffect(() => {
        if (
            hmrcBusinesses?.businesses.listOfBusinesses &&
            hmrcBusinesses.businesses.listOfBusinesses.length > 0
        ) {
            setActiveBusiness(
                hmrcBusinesses.businesses.listOfBusinesses[0]?.businessId ?? '',
            );
        }
    }, [hmrcBusinesses]);

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
            {activeTab === 'documents' && (
                <ClientDocuments
                    clientId={clientId}
                    businessId={activeBusiness}
                    typeOfBusiness={
                        hmrcBusinesses?.businesses.listOfBusinesses.find(
                            (business) =>
                                business.businessId === activeBusiness,
                        )?.typeOfBusiness || undefined
                    }
                />
            )}

            {/* Content based on active tab */}
            {activeTab === 'financials' && (
                <ClientFinancials
                    clientId={clientId}
                    activeBusiness={activeBusiness}
                    nino={client.nino}
                    typeOfBusiness={
                        hmrcBusinesses?.businesses.listOfBusinesses.find(
                            (business) =>
                                business.businessId === activeBusiness,
                        )?.typeOfBusiness || ''
                    }
                />
            )}
            {activeTab === 'overview' && (
                <>
                    <HmrcAuthStatus
                        clientId={clientId}
                        invitationId={client?.invitationId as string}
                    />
                    <HmrcBusinesses
                        businesses={
                            hmrcBusinesses?.businesses.listOfBusinesses || []
                        }
                        isLoadingHmrcBusinesses={isLoadingHmrcBusinesses}
                    />
                </>
            )}
        </div>
    );
}
