'use client';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { AgencyRelationshipResponse } from '@/services/clients';

interface RelationshipPopupProps {
    isOpen: boolean;
    onClose: () => void;
    relationshipData: AgencyRelationshipResponse | null;
    onRequestRelationship?: () => void;
    isLoading?: boolean;
    isCheckingRelationship?: boolean;
}

export default function RelationshipPopup({
    isOpen,
    onClose,
    relationshipData,
    onRequestRelationship,
    isLoading = false,
    isCheckingRelationship = false,
}: RelationshipPopupProps) {
    if (!relationshipData && !isCheckingRelationship) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isCheckingRelationship ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                Checking Agency Relationship
                            </>
                        ) : relationshipData?.hasRelationship ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Connection Established
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                Request Agency Connection
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {isCheckingRelationship ? (
                        // Loading State
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Checking agency relationship
                                        </h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            We're checking if this client is
                                            already connected to your agency
                                            through HMRC.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : relationshipData?.hasRelationship ? (
                        // Existing Relationship Popup
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-green-800">
                                            Agency relationship already exists
                                        </h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            This client is already connected to
                                            your agency through HMRC. You can
                                            proceed with managing their tax
                                            affairs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {relationshipData.relationshipData && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        Relationship Details
                                    </h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>
                                            <span className="font-medium">
                                                Status:
                                            </span>{' '}
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    relationshipData
                                                        .relationshipData
                                                        .status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {
                                                    relationshipData
                                                        .relationshipData.status
                                                }
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Services:
                                            </span>{' '}
                                            {relationshipData.relationshipData.service.join(
                                                ', ',
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Checked:
                                            </span>{' '}
                                            {new Date(
                                                relationshipData.relationshipData.checkedAt,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // No Relationship Popup
                        <div className="space-y-4">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-orange-800">
                                            No existing relationship found
                                        </h3>
                                        <p className="text-sm text-orange-700 mt-1">
                                            This client is not currently
                                            connected to your agency. You can
                                            request a relationship to manage
                                            their tax affairs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    Next Steps
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Request relationship through HMRC</li>
                                    <li>
                                        • Client will receive authorization
                                        request
                                    </li>
                                    <li>
                                        • Once approved, you can manage their
                                        affairs
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-yellow-900 mb-2">
                                    What happens next?
                                </h4>
                                <div className="text-sm text-yellow-800 space-y-2">
                                    <p>When you request a relationship:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>
                                            HMRC will send an invitation to the
                                            client
                                        </li>
                                        <li>
                                            The client needs to log into their
                                            HMRC account
                                        </li>
                                        <li>
                                            They must authorize your agency to
                                            act on their behalf
                                        </li>
                                        <li>
                                            You'll be notified once the
                                            relationship is active
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        {isCheckingRelationship ? (
                            <Button
                                onClick={onClose}
                                variant="outline"
                                disabled
                            >
                                Cancel
                            </Button>
                        ) : relationshipData?.hasRelationship ? (
                            <Button onClick={onClose} variant="default">
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button onClick={onClose} variant="outline">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onRequestRelationship}
                                    variant="default"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? 'Requesting...'
                                        : 'Request Relationship'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
