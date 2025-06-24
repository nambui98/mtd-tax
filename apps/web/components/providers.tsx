'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
            >
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </NextThemesProvider>
        </SessionProvider>
    );
}
