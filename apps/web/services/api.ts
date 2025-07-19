import type {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { authOptions } from '@/lib/auth';
import { Env } from '@/lib/env';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

const API_URL = Env.NEXT_PUBLIC_BACKEND_API_URL || '/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export type AxiosErrorData = {
    error: string;
    statusCode: number;
    message: string;
};

// Add request interceptor for authentication
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<{ skipAuth?: boolean }>) => {
        // Check if auth should be skipped
        const skipAuth = config.headers.skipAuth;
        console.log('====================================');
        console.log(skipAuth);
        console.log('====================================');
        if (skipAuth) {
            return config;
        }

        let session = null;
        if (typeof window !== 'undefined') {
            session = await getSession();
        } else {
            session = await getServerSession(authOptions);
        }

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session?.accessToken}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error),
);

api.interceptors.response.use(
    (response: AxiosResponse<any>) => response,
    (error: AxiosError<AxiosErrorData>) => {
        return Promise.reject(error.response?.data);
    },
);
