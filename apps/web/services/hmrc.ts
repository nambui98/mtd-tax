import { api } from './api';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const hmrcService = {
    async connectToHmrc() {
        const response = await api.get(`${API_URL}/hmrc/authorize`, {
            headers: {
                skipAuth: true,
            },
        });
        return response.data;
    },

    async exchangeCodeForToken(code: string) {
        const response = await api.get(`${API_URL}/hmrc/callback`, {
            params: {
                code,
            },
        });
        return response;
    },

    getVatObligations: async (vrn: string) => {
        const response = await api.get(
            `${API_URL}/hmrc/vat/obligations?vrn=${vrn}`,
        );
        return response;
    },

    submitVatReturn: async (vrn: string, returnData: any) => {
        const response = await api.post(
            `${API_URL}/hmrc/vat/returns?vrn=${vrn}`,
            returnData,
        );
        return response;
    },

    getVatLiabilities: async (vrn: string) => {
        const response = await api.get(
            `${API_URL}/hmrc/vat/liabilities?vrn=${vrn}`,
        );
        return response;
    },
};
