import { Env } from '@/lib/env';
import { api } from './api';
import { AxiosResponse } from 'axios';

export type InvitationResponse = {
    invitations: Array<{
        agencyType: string;
        arn: string;
        clientActionUrl: string;
        created: string;
        expiresOn: string;
        invitationId: string;
        service: string[];
        status: 'Pending' | 'Accepted' | 'Rejected';
        _links: {
            self: {
                href: string;
            };
        };
    }>;
};

export type Business = {
    businessId: string;
    businessName: string;
    businessType: string;
    tradingName?: string;
    address: {
        line1: string;
        line2?: string;
        line3?: string;
        line4?: string;
        postcode: string;
        countryCode: string;
    };
    accountingPeriod: {
        startDate: string;
        endDate: string;
    };
    accountingType: string;
    commencementDate: string;
    cessationDate?: string;
    businessDescription?: string;
    emailAddress?: string;
    websiteAddress?: string;
    contactDetails?: {
        phoneNumber?: string;
        mobileNumber?: string;
        faxNumber?: string;
    };
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        sortCode: string;
    };
    industryClassifications?: {
        sicCode?: string;
        sicDescription?: string;
    };
    links: Array<{
        href: string;
        rel: string;
        method: string;
    }>;
};

export type Businesses = {
    listOfBusinesses: ListOfBusiness[];
    links: Link[];
};

export type Link = {
    href: string;
    method: string;
    rel: string;
};

export type ListOfBusiness = {
    typeOfBusiness: string;
    businessId: string;
    tradingName: string;
    links: Link[];
};
export type ClientBusinessesResponse = {
    businesses: Businesses;
};

export const hmrcService = {
    async connectToHmrc(arn: string, utr: string, nino: string) {
        const response = await api.post(`/hmrc/authorize`, {
            arn,
            utr,
            nino,
        });
        return response.data;
    },

    async exchangeCodeForToken(code: string) {
        const response = await api.get(`/hmrc/callback`, {
            params: {
                code,
            },
        });
        return response;
    },
    getInvitations: async (arn?: string): Promise<InvitationResponse> => {
        const params = arn ? `?arn=${arn}` : '';
        const response = await api.get(`/hmrc/invitations${params}`);
        return response.data.data;
    },
    getVatObligations: async (vrn: string) => {
        const response = await api.get(`/hmrc/vat/obligations?vrn=${vrn}`);
        return response;
    },

    submitVatReturn: async (vrn: string, returnData: any) => {
        const response = await api.post(
            `/hmrc/vat/returns?vrn=${vrn}`,
            returnData,
        );
        return response;
    },

    getVatLiabilities: async (vrn: string) => {
        const response = await api.get(`/hmrc/vat/liabilities?vrn=${vrn}`);
        return response;
    },

    getClientBusinesses: async (
        clientId: string,
        clientIdType: 'ni' | 'utr' = 'utr',
        knownFact: string,
    ): Promise<ClientBusinessesResponse> => {
        const response = await api.get(`/hmrc/clients/${clientId}/businesses`, {
            params: { clientIdType, knownFact },
        });
        return response.data.data;
    },

    getClientBusinessDetails: async (
        clientId: string,
        businessId: string,
    ): Promise<Business> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}`,
        );
        return response.data;
    },
};
