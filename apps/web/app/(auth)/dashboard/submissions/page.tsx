import React from 'react';
import ClientsContent from '../clients/components/content';
import MainPageWrapper from '@/components/layout/main-page-wrapper';
import SubmissionsContent from './components/submissions-content';

type Props = {};

export default function SubmissionsPage({}: Props) {
    return (
        <MainPageWrapper title="Client Submissions">
            <SubmissionsContent />
        </MainPageWrapper>
    );
}
