'use client';
import { clientsService } from '@/services/clients';
import { useQuery } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import React from 'react';

type Props = {
    clientId: string;
};

export default function ClientDocuments({ clientId }: Props) {
    const { data: documents, isLoading: isLoadingDocuments } = useQuery({
        queryKey: ['documents', clientId],
        queryFn: () => clientsService.getClientDocuments(clientId as string),
        enabled: !!clientId,
    });
    return (
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Consulting Business Documents
                    </h2>
                    <button className="text-primary hover:text-primary-dark text-sm">
                        Upload <Upload className="w-3 h-3 inline ml-1" />
                    </button>
                </div>
            </div>
            <div className="p-6">
                {isLoadingDocuments ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* {documents
                    ?.slice(0, 4)
                    .map((document, index) => (
                        <div
                            key={index}
                            className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                        >
                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                    {document.name}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {
                                        document.uploadDate
                                    }
                                    <User className="w-3 h-3 ml-3 mr-1" />
                                    {
                                        document.uploadedBy
                                    }
                                    <Check className="w-3 h-3 ml-3 mr-1" />
                                    {document.status}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                    <Download className="w-3 h-3 text-gray-500" />
                                </button>
                                <button className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                    <Eye className="w-3 h-3 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))} */}
                    </div>
                )}
            </div>
        </div>
    );
}
