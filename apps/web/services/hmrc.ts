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
        nino: string,
    ): Promise<Business> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}?nino=${nino}`,
        );
        return response.data;
    },

    getBusinessIncomeSummary: async (
        clientId: string,
        businessId: string,
        nino: string,
        taxYear: string = '2023-24',
    ): Promise<{
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
        incomeBreakdown: Array<{
            category: string;
            amount: number;
        }>;
        expenseBreakdown: Array<{
            category: string;
            amount: number;
        }>;
        accountingPeriod: {
            startDate: string;
            endDate: string;
        };
    }> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}/income-summary?nino=${nino}&taxYear=${taxYear}`,
        );
        return response.data;
    },

    getBusinessSourceAdjustableSummary: async (
        clientId: string,
        businessId: string,
        nino: string,
        taxYear: string = '2023-24',
    ): Promise<{
        bsasId: string;
        accountingPeriod: {
            startDate: string;
            endDate: string;
        };
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
        adjustments: Array<{
            type: string;
            description: string;
            amount: number;
        }>;
        status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    }> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}/bsas?nino=${nino}&taxYear=${taxYear}`,
        );
        return response.data;
    },

    getBusinessObligations: async (
        clientId: string,
        businessId: string,
        nino: string,
        taxYear: string = '2023-24',
    ): Promise<{
        obligations: Array<{
            obligationId: string;
            obligationType: string;
            dueDate: string;
            status: 'open' | 'fulfilled' | 'overdue';
            periodKey: string;
            startDate: string;
            endDate: string;
        }>;
    }> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}/obligations?nino=${nino}&taxYear=${taxYear}`,
        );
        return response.data;
    },

    getComprehensiveBusinessInfo: async (
        clientId: string,
        businessId: string,
        nino: string,
        typeOfBusiness: string,
        taxYear: string = '2024-25',
    ): Promise<{
        businessDetails: Business | null;
        incomeSummary: {
            totalIncome: number;
            totalExpenses: number;
            netProfit: number;
            incomeBreakdown: Array<{
                category: string;
                amount: number;
            }>;
            expenseBreakdown: Array<{
                category: string;
                amount: number;
            }>;
            accountingPeriod: {
                startDate: string;
                endDate: string;
            };
        } | null;
        bsasData: {
            bsasId: string;
            accountingPeriod: {
                startDate: string;
                endDate: string;
            };
            totalIncome: number;
            totalExpenses: number;
            netProfit: number;
            adjustments: Array<{
                type: string;
                description: string;
                amount: number;
            }>;
            status: 'draft' | 'submitted' | 'accepted' | 'rejected';
        } | null;
        obligations: {
            obligations: Array<{
                obligationId: string;
                obligationType: string;
                dueDate: string;
                status: 'open' | 'fulfilled' | 'overdue';
                periodKey: string;
                startDate: string;
                endDate: string;
            }>;
        } | null;
    }> => {
        const response = await api.get(
            `/hmrc/clients/${clientId}/businesses/${businessId}/comprehensive?nino=${nino}&taxYear=${taxYear}&typeOfBusiness=${typeOfBusiness}`,
        );
        return response.data.data;
    },

    getHmrcCategories: async (): Promise<{
        businessCategories: Array<{
            code: string;
            name: string;
            description: string;
            type: 'income' | 'expense' | 'both';
        }>;
        transactionCategories: Array<{
            code: string;
            name: string;
            description: string;
            parentCategory?: string;
            isStandard: boolean;
        }>;
    }> => {
        const response = await api.get('/hmrc/categories');
        return response.data;
    },
};
