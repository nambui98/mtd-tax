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
import { authService } from './auth';

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

// Add response interceptor for handling token refresh
api.interceptors.response.use(
    (response: AxiosResponse<any>) => response,
    async (error: AxiosError<AxiosErrorData>) => {
        const originalRequest = error.config as any;

        // If the error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get current session
                let session = null;
                if (typeof window !== 'undefined') {
                    session = await getSession();
                } else {
                    session = await getServerSession(authOptions);
                }

                if (session?.refreshToken) {
                    // Try to refresh the token
                    const response = await fetch(
                        `${Env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh-tokens`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                refreshToken: session.refreshToken,
                            }),
                        },
                    );

                    if (response.ok) {
                        const data = await response.json();

                        // Update the session with new tokens
                        if (typeof window !== 'undefined') {
                            // For client-side, we need to update the session
                            // This is a simplified approach - in a real app you might want to use a more robust solution
                            localStorage.setItem(
                                'accessToken',
                                data.access_token,
                            );
                            localStorage.setItem(
                                'refreshToken',
                                data.refresh_token,
                            );
                        }

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Redirect to login page or handle refresh failure
                if (typeof window !== 'undefined') {
                    window.location.href = '/sign-in';
                }
            }
        }

        return Promise.reject(error.response?.data || error);
    },
);
