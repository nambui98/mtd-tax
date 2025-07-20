import {
    Client,
    ClientResponse,
    InsertClient,
} from '@workspace/database/dist/schema/clients';
import { api } from './api';
import { User } from '@workspace/database/dist/schema/users.js';
import { AxiosResponse } from 'axios';

export type Transaction = {
    id: string;
    clientId: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    createdAt: string;
};

export type Document = {
    id: string;
    clientId: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
    uploadedBy: string;
    status: string;
    url?: string;
};

export type SignupData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
    acceptReceiveNews?: boolean;
};

export type SignupResponse = {
    userId: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
};

export type OtpRequestResponse = {
    challengeName: string;
    session: string;
    message: string;
};

export type OtpVerifyResponse = {
    success: boolean;
    userId?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
};

export type LoginOtpRequestResponse = {
    message: string;
};

export type LoginOtpVerifyResponse = {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    };
};

export type AgencyRelationshipResponse = {
    hasRelationship: boolean;
    relationshipData?: {
        service: string[];
        status: 'active' | 'inactive';
        arn: string;
        clientId: string;
        clientIdType: string;
        checkedAt: string;
    };
};

export type RelationshipRequestResponse = {
    success: boolean;
    invitationId?: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
};

export type PendingInvitation = {
    invitationId: string;
    clientId: string;
    clientIdType: string;
    service: string[];
    status: 'pending' | 'accepted' | 'rejected';
    createdDate: string;
};

export type PendingInvitationsResponse = {
    invitations: PendingInvitation[];
};

export type ClientInvitationStatus = {
    clientId: string;
    utr?: string;
    invitationStatus:
        | 'pending'
        | 'accepted'
        | 'rejected'
        | 'not_requested'
        | 'error';
    invitationId?: string;
    lastChecked?: string;
};

export type ClientsWithInvitationStatus = (Client & {
    assignee: User;
    invitationStatus?: ClientInvitationStatus;
})[];

export const clientsService = {
    createClient: async (client: InsertClient): Promise<Client> => {
        const response = await api.post('/clients', client);
        return response.data.data; // Response interceptor wraps in data object
    },
    getMyClients: async (filters?: {
        search?: string;
        businessType?: string;
        assignee?: string;
    }): Promise<(Client & { assignee: User })[]> => {
        console.log('====================================');
        console.log(filters);
        console.log('====================================');
        const response = await api.get('/clients/my', {
            params: {
                search: filters?.search,
                businessType: filters?.businessType,
                assignee: filters?.assignee,
            },
        });
        return response.data.data;
    },

    getClientsWithInvitationStatus: async (filters?: {
        search?: string;
        businessType?: string;
        assignee?: string;
    }): Promise<ClientsWithInvitationStatus> => {
        const response = await api.get('/clients/my-with-invitation-status', {
            params: {
                search: filters?.search,
                businessType: filters?.businessType,
                assignee: filters?.assignee,
            },
        });
        return response.data.data;
    },
    checkAgencyRelationship: async (
        nino: string,
        arn?: string,
        knownFact?: string,
    ): Promise<AgencyRelationshipResponse> => {
        const response = await api.post('/hmrc/check-agency-relationship', {
            nino,
            ...(arn && { arn }),
            ...(knownFact && { knownFact }),
        });
        return response.data;
    },
    requestAgencyRelationship: async ({
        clientId,
        nino,
        knownFact,
    }: {
        clientId: string;
        nino: string;
        knownFact?: string;
    }): Promise<RelationshipRequestResponse> => {
        const response = await api.post('/hmrc/request-agency-relationship', {
            nino,
            ...(knownFact && { knownFact }),
            clientId,
        });
        return response.data;
    },
    getPendingInvitations: async (
        agencyId: string,
    ): Promise<PendingInvitationsResponse> => {
        const response = await api.get('/hmrc/pending-invitations', {
            params: { agencyId },
        });
        return response.data;
    },

    getClientById: async (
        clientId: string,
    ): Promise<Client & { assignee: User }> => {
        const response = await api.get(`/clients/${clientId}`);
        return response.data.data;
    },

    getClientTransactions: async (clientId: string): Promise<Transaction[]> => {
        const response = await api.get(`/clients/${clientId}/transactions`);
        return response.data;
    },

    getClientDocuments: async (clientId: string): Promise<Document[]> => {
        const response = await api.get(`/clients/${clientId}/documents`);
        return response.data;
    },
};
