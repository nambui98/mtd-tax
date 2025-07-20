import MainPageWrapper from '@/components/layout/main-page-wrapper';
import React from 'react';
import ClientContent from './components/client-content';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ClientPage({ params }: Props) {
    const { id } = await params;
    return (
        <MainPageWrapper title="Client Details">
            <ClientContent clientId={id} />
        </MainPageWrapper>
    );
}
