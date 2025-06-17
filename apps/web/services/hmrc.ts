import { Env } from '@/lib/env';
import { api } from './api';

export const hmrcService = {
    async connectToHmrc() {
        const response = await api.get(`/hmrc/authorize`, {
            headers: {
                skipAuth: true,
            },
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
};
