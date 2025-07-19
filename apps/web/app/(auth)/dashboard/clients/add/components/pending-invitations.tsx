'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientsService, PendingInvitation } from '@/services/clients';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PendingInvitationsProps {
    agencyId: string;
}

export default function PendingInvitations({
    agencyId,
}: PendingInvitationsProps) {
    const {
        data: invitationsData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['pending-invitations', agencyId],
        queryFn: () => clientsService.getPendingInvitations(agencyId),
        enabled: !!agencyId,
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'accepted':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'accepted':
                return <Badge variant="default">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Loading Pending Invitations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-600">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    const invitations = invitationsData?.invitations || [];

    if (invitations.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pending Relationship Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Pending Invitations
                        </h3>
                        <p className="text-sm text-gray-600">
                            All relationship requests have been processed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Pending Relationship Invitations</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {invitations.map((invitation: PendingInvitation) => (
                        <div
                            key={invitation.invitationId}
                            className="border rounded-lg p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(invitation.status)}
                                    <span className="font-medium">
                                        UTR: {invitation.clientId}
                                    </span>
                                </div>
                                {getStatusBadge(invitation.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">
                                        Services:
                                    </span>
                                    <div className="mt-1">
                                        {invitation.service.map((service) => (
                                            <Badge
                                                key={service}
                                                variant="outline"
                                                className="mr-1 mb-1"
                                            >
                                                {service}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Created:
                                    </span>
                                    <div className="text-gray-600">
                                        {formatDate(invitation.createdDate)}
                                    </div>
                                </div>
                            </div>

                            {invitation.status === 'pending' && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Status:</strong> Waiting for
                                        client to authorize the relationship in
                                        their HMRC account.
                                    </p>
                                </div>
                            )}

                            {invitation.status === 'accepted' && (
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                    <p className="text-sm text-green-800">
                                        <strong>Status:</strong> Relationship
                                        has been authorized by the client.
                                    </p>
                                </div>
                            )}

                            {invitation.status === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-sm text-red-800">
                                        <strong>Status:</strong> Relationship
                                        request was rejected by the client.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
