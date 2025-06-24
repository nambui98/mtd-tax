import { Client, InsertClient } from '@workspace/database/dist/schema/clients';
import { api } from './api';
import { User } from '@workspace/database/dist/schema/users.js';

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

export const usersService = {
    getStaffUsers: async (): Promise<User[]> => {
        const response = await api.get('/users/staff');
        return response.data.data;
    },
    createClient: async (client: InsertClient): Promise<Client> => {
        const response = await api.post('/clients', client);
        return response.data.data;
    },
};
