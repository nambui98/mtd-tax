import MainPageWrapper from '@/components/layout/main-page-wrapper';
import React from 'react';
import DocumentsContent from './components/documents-content';

type Props = {};

export default function DocumentsPage({}: Props) {
    return (
        <MainPageWrapper title="Documents">
            <DocumentsContent />
        </MainPageWrapper>
    );
}
