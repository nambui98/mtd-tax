'use client';
import React from 'react';
import { getInvitationStatusBadge } from './client-content';
import { hmrcService } from '@/services/hmrc';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type Props = {
    clientId: string;
    invitationId: string;
};

export default function HmrcAuthStatus({ clientId, invitationId }: Props) {
    const { data: session } = useSession();
    const { data: invitations, isLoading: isLoadingInvitations } = useQuery({
        queryKey: ['invitations', session?.user?.agentReferenceNumber],
        queryFn: () =>
            hmrcService.getInvitations(
                session?.user?.agentReferenceNumber ?? '',
            ),
        enabled: !!invitationId,
    });
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                HMRC Authorization Status
            </h3>
            <div className="flex items-center space-x-4">
                {getInvitationStatusBadge(
                    invitations?.invitations?.find(
                        (invitation: any) =>
                            invitation.invitationId === invitationId,
                    )?.status,
                )}
                <span className="text-sm text-gray-600">
                    Last checked: {new Date().toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}
