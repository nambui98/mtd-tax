declare global {
    interface InternalAxiosRequestConfig {
        skipAuth?: boolean;
    }
}

export {};
