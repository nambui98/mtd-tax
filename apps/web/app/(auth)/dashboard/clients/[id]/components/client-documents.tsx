'use client';

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
    Upload,
    Eye,
    Download,
    MoreVertical,
    Filter,
    Plus,
    ChevronRight,
    Calendar,
    Briefcase,
    Home,
    Globe,
    User,
    FileText,
    Bell,
    Check,
    X,
    Edit,
    Unlink,
    Search,
    ChevronLeft,
    Minus,
    ZoomIn,
    ZoomOut,
    Expand,
    Bot,
    Cloud,
    File,
    FileSpreadsheet,
    Image,
    Send,
    FileDown,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import UploadDialog from '@/app/(auth)/dashboard/documents/components/upload-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '@/services/documents';
import { toast } from 'sonner';
import { TypeOfBusiness } from '@/types/document';

type Props = {
    clientId: string;
    businessId: string;
    typeOfBusiness?: TypeOfBusiness;
};

export default function ClientDocuments({
    clientId,
    businessId,
    typeOfBusiness,
}: Props) {
    const [isLoadingDocuments] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<any>(null);
    const [showAddTransactionModal, setShowAddTransactionModal] =
        useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] =
        useState('All Document Types');
    const [selectedBusiness, setSelectedBusiness] = useState('All Businesses');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [showRemoteDocuments, setShowRemoteDocuments] = useState(false);

    // Fetch documents for this client
    const {
        data: documents,
        isLoading: documentsLoading,
        refetch: refetchDocuments,
    } = useQuery({
        queryKey: ['client-documents', clientId],
        queryFn: () => documentsService.getDocuments({ clientId }),
        enabled: !!clientId,
    });

    // Fetch remote documents for this client
    const {
        data: remoteDocuments,
        isLoading: remoteDocumentsLoading,
        refetch: refetchRemoteDocuments,
    } = useQuery({
        queryKey: ['client-remote-documents', clientId],
        queryFn: () => documentsService.getRemoteDocuments(clientId),
        enabled: !!clientId && showRemoteDocuments,
    });

    // Fetch document statistics
    const { data: documentStats } = useQuery({
        queryKey: ['client-document-stats', clientId],
        queryFn: () => documentsService.getDocumentStats(clientId),
        enabled: !!clientId,
    });

    // Delete document mutation
    const deleteDocumentMutation = useMutation({
        mutationFn: (documentId: string) =>
            documentsService.deleteDocument(documentId),
        onSuccess: () => {
            toast.success('Document deleted successfully');
            refetchDocuments();
        },
        onError: (error: any) => {
            toast.error(`Failed to delete document: ${error.message}`);
        },
    });

    // Download document mutation
    const downloadDocumentMutation = useMutation({
        mutationFn: async (documentId: string) => {
            const result =
                await documentsService.getDocumentDownloadUrl(documentId);
            return result.downloadUrl;
        },
        onSuccess: (downloadUrl) => {
            // Open download URL in new tab
            window.open(downloadUrl, '_blank');
            toast.success('Download started');
        },
        onError: (error: any) => {
            toast.error(`Failed to download document: ${error.message}`);
        },
    });

    // Sync remote document mutation
    const syncRemoteDocumentMutation = useMutation({
        mutationFn: async ({
            documentId,
            clientId,
            businessId,
        }: {
            documentId: string;
            clientId: string;
            businessId?: string;
        }) => {
            return documentsService.syncRemoteDocument(
                documentId,
                clientId,
                businessId,
            );
        },
        onSuccess: () => {
            toast.success('Remote document synced successfully');
            refetchDocuments();
            refetchRemoteDocuments();
        },
        onError: (error: any) => {
            toast.error(`Failed to sync remote document: ${error.message}`);
        },
    });

    // Refresh remote documents mutation
    const refreshRemoteDocumentsMutation = useMutation({
        mutationFn: async (clientId: string) => {
            return documentsService.refreshRemoteDocuments(clientId);
        },
        onSuccess: (result) => {
            toast.success(`Refreshed ${result.synced} remote documents`);
            refetchRemoteDocuments();
        },
        onError: (error: any) => {
            toast.error(`Failed to refresh remote documents: ${error.message}`);
        },
    });

    const handleDeleteDocument = (documentId: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            deleteDocumentMutation.mutate(documentId);
        }
    };

    const handleDownloadDocument = (documentId: string) => {
        downloadDocumentMutation.mutate(documentId);
    };

    const handleEditDocument = (doc: any) => {
        setDocumentToEdit(doc);
        setShowUploadDialog(true);
    };

    const handleSyncRemoteDocument = (remoteDoc: any) => {
        syncRemoteDocumentMutation.mutate({
            documentId: remoteDoc.id,
            clientId,
            businessId,
        });
    };

    const handleRefreshRemoteDocuments = () => {
        refreshRemoteDocumentsMutation.mutate(clientId);
    };

    const handleToggleRemoteDocuments = () => {
        setShowRemoteDocuments(!showRemoteDocuments);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter documents based on search and filters
    const filteredDocuments =
        documents?.filter((doc) => {
            const matchesType =
                selectedDocumentType === 'All Document Types' ||
                doc.documentType.includes(selectedDocumentType.toLowerCase());
            const matchesBusiness =
                selectedBusiness === 'All Businesses' ||
                doc.businessId === selectedBusiness;
            const matchesStatus =
                selectedStatus === 'All Statuses' ||
                doc.status === selectedStatus;
            const matchesSearch =
                searchTerm === '' ||
                doc.originalFileName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return (
                matchesType && matchesBusiness && matchesStatus && matchesSearch
            );
        }) || [];

    console.log(filteredDocuments);

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <File className="w-6 h-6 text-red-500" />;
            case 'excel':
                return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
            case 'image':
                return <Image className="w-6 h-6 text-blue-500" />;
            default:
                return <File className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processed':
            case 'approved':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'error':
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'processed':
            case 'approved':
                return 'Processed';
            case 'pending':
                return 'Processing';
            case 'error':
                return 'Needs Review';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Unknown';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'processed':
            case 'approved':
                return 'text-green-700';
            case 'pending':
                return 'text-yellow-700';
            case 'error':
            case 'rejected':
                return 'text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    const getTagColor = (tag: string) => {
        switch (tag.toLowerCase()) {
            case 'invoice':
                return 'bg-blue-100 text-blue-800';
            case 'receipt':
                return 'bg-green-100 text-green-800';
            case 'bank statement':
                return 'bg-cyan-100 text-cyan-800';
            case 'tax document':
                return 'bg-yellow-100 text-yellow-800';
            case 'expense':
                return 'bg-red-100 text-red-800';
            case 'income':
            case 'income report':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Helper function to group documents by month
    const groupDocumentsByMonth = (docs: any[]) => {
        const groups: Record<string, any[]> = {};

        if (!docs || !Array.isArray(docs)) {
            return groups;
        }

        docs.forEach((doc) => {
            if (!doc.uploadedAt) return;

            try {
                const date = new Date(doc.uploadedAt);
                if (isNaN(date.getTime())) return; // Invalid date

                const monthKey = date.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                });

                if (monthKey && !groups[monthKey]) {
                    groups[monthKey] = [];
                }
                if (monthKey && groups[monthKey]) {
                    groups[monthKey]!.push(doc);
                }
            } catch (error) {
                // Skip invalid dates
                console.warn(
                    'Invalid date for document:',
                    doc?.id || 'unknown',
                    doc?.uploadedAt,
                );
            }
        });

        return groups;
    };

    // Helper function to get document display name
    const getDocumentDisplayName = (doc: any) => {
        return doc.originalFileName || doc.fileName || 'Untitled Document';
    };

    // Helper function to get document file type for icon
    const getDocumentFileType = (doc: any) => {
        return doc.fileType || 'unknown';
    };

    return (
        <div className="space-y-6">
            {/* AI Document Processing Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <div className="flex items-start">
                    <div className="text-blue-500 mr-4">
                        <Bot className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <div className="text-blue-900 font-semibold mb-2">
                            AI Document Processing
                        </div>
                        <div className="text-blue-700 text-sm mb-2">
                            Our AI is processing recently uploaded documents.
                            Transaction data extraction and categorization will
                            complete shortly.
                        </div>
                        <div className="flex gap-4 text-xs text-blue-900">
                            <div>
                                <span className="font-semibold">
                                    {documentStats?.total || 0}
                                </span>{' '}
                                documents processed today
                            </div>
                            <div>
                                <span className="font-semibold">
                                    {documentStats?.totalTransactions || 0}
                                </span>{' '}
                                transactions extracted
                            </div>
                            <div>
                                <span className="font-semibold">
                                    {documentStats?.aiAccuracy
                                        ? `${(documentStats.aiAccuracy * 100).toFixed(0)}%`
                                        : '95%'}
                                </span>{' '}
                                accuracy rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
                <div className="text-gray-400 mb-3 flex justify-center">
                    <Cloud className="w-12 h-12" />
                </div>
                <div className="text-gray-900 font-medium mb-2">
                    Drag & drop documents here or click to browse
                </div>
                <div className="text-gray-600 text-sm max-w-md mx-auto">
                    Upload receipts, invoices, bank statements, and other
                    financial documents. Our AI will automatically extract
                    transaction data and suggest categorizations.
                </div>
            </div>

            {/* Document Filters and Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3 flex-1">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDocumentType}
                        onChange={(e) =>
                            setSelectedDocumentType(e.target.value)
                        }
                    >
                        <option>All Document Types</option>
                        <option>Receipts</option>
                        <option>Invoices</option>
                        <option>Bank Statements</option>
                        <option>Tax Documents</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedBusiness}
                        onChange={(e) => setSelectedBusiness(e.target.value)}
                    >
                        <option>All Businesses</option>
                        <option>Consulting (Self-Employed)</option>
                        <option>Property Rental</option>
                        <option>Foreign Income</option>
                    </select>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option>All Statuses</option>
                        <option>Processed</option>
                        <option>Pending</option>
                        <option>Error</option>
                    </select>
                </div>
                <div className="flex gap-3 ml-3">
                    <Button variant="outline" size="lg">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleToggleRemoteDocuments}
                        className={
                            showRemoteDocuments
                                ? 'bg-blue-50 border-blue-200'
                                : ''
                        }
                    >
                        <Cloud className="w-4 h-4 mr-2" />
                        {showRemoteDocuments ? 'Hide Remote' : 'Show Remote'}
                    </Button>
                    <UploadDialog
                        clientId={clientId}
                        businessId={businessId}
                        typeOfBusiness={typeOfBusiness}
                    >
                        <Button size="lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Upload
                        </Button>
                    </UploadDialog>
                </div>
            </div>

            {/* Recent Documents Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recent Documents
                </h2>
                <a
                    href="#"
                    className="text-blue-600 text-sm flex items-center hover:text-blue-700"
                >
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                </a>
            </div>

            {/* Remote Documents Section */}
            {showRemoteDocuments && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                            Remote Documents
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefreshRemoteDocuments}
                            disabled={refreshRemoteDocumentsMutation.isPending}
                        >
                            {refreshRemoteDocumentsMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Refresh
                        </Button>
                    </div>

                    {/* Remote Documents Loading */}
                    {remoteDocumentsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">
                                Loading remote documents...
                            </span>
                        </div>
                    ) : remoteDocuments?.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                No remote documents available
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Click "Refresh" to check for new remote
                                documents
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {remoteDocuments?.map((remoteDoc) => (
                                <div
                                    key={remoteDoc.id}
                                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                                        <Cloud className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 mb-1">
                                            {remoteDoc.originalFileName}
                                        </div>
                                        <div className="flex text-xs text-gray-600 gap-4 flex-wrap">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(
                                                    remoteDoc.uploadedAt,
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <FileText className="w-3 h-3 mr-1" />
                                                {formatFileSize(
                                                    remoteDoc.fileSize,
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-blue-600 font-medium">
                                                    {(remoteDoc as any)
                                                        .source || 'Remote'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {remoteDoc.documentType?.map(
                                                (
                                                    type: string,
                                                    index: number,
                                                ) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 text-xs rounded-full ${getTagColor(type)}`}
                                                    >
                                                        {type}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center mr-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span className="text-xs font-medium text-green-700">
                                            Available
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                                            onClick={() =>
                                                handleSyncRemoteDocument(
                                                    remoteDoc,
                                                )
                                            }
                                            disabled={
                                                syncRemoteDocumentMutation.isPending
                                            }
                                        >
                                            {syncRemoteDocumentMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {documentsLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                        Loading documents...
                    </span>
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents found</p>
                </div>
            ) : (
                <>
                    {/* Dynamic Document Groups by Month */}
                    {(() => {
                        const groupedDocuments =
                            groupDocumentsByMonth(filteredDocuments);
                        const sortedMonths = Object.keys(groupedDocuments).sort(
                            (a, b) => {
                                const dateA = new Date(a);
                                const dateB = new Date(b);
                                return dateB.getTime() - dateA.getTime(); // Sort by newest first
                            },
                        );

                        return sortedMonths.map((monthKey) =>
                            monthKey ? (
                                <div key={monthKey}>
                                    <div className="text-sm font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-4">
                                        {monthKey}
                                    </div>
                                    <div className="space-y-0">
                                        {groupedDocuments[monthKey]?.map(
                                            (doc) =>
                                                doc ? (
                                                    <div
                                                        key={doc.id}
                                                        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                                                        onClick={() =>
                                                            setShowPreviewModal(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                                            {getDocumentIcon(
                                                                getDocumentFileType(
                                                                    doc,
                                                                ),
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 mb-1">
                                                                {getDocumentDisplayName(
                                                                    doc,
                                                                )}
                                                            </div>
                                                            <div className="flex text-xs text-gray-600 gap-4 flex-wrap">
                                                                <div className="flex items-center">
                                                                    <Calendar className="w-3 h-3 mr-1" />
                                                                    {formatDate(
                                                                        doc.uploadedAt,
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Briefcase className="w-3 h-3 mr-1" />
                                                                    {doc.businessId ||
                                                                        'All Businesses'}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <User className="w-3 h-3 mr-1" />
                                                                    Client
                                                                    Upload
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <FileText className="w-3 h-3 mr-1" />
                                                                    {formatFileSize(
                                                                        doc.fileSize,
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                {doc
                                                                    .documentType
                                                                    .length > 0
                                                                    ? doc.documentType?.flatMap(
                                                                          (
                                                                              type: string,
                                                                              index: number,
                                                                          ) =>
                                                                              type ? (
                                                                                  <span
                                                                                      key={
                                                                                          index
                                                                                      }
                                                                                      className={`px-2 py-1 text-xs rounded-full ${getTagColor(type)}`}
                                                                                  >
                                                                                      {
                                                                                          type
                                                                                      }
                                                                                  </span>
                                                                              ) : (
                                                                                  []
                                                                              ),
                                                                      )
                                                                    : null}
                                                                {doc.aiExtractedTransactions &&
                                                                doc
                                                                    .aiExtractedTransactions
                                                                    .length >
                                                                    0 ? (
                                                                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                                                        {
                                                                            doc.aiExtractedTransactions
                                                                        }{' '}
                                                                        transactions
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center mr-4">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)} mr-2`}
                                                            ></div>
                                                            <span
                                                                className={`text-xs font-medium ${getStatusTextColor(doc.status)}`}
                                                            >
                                                                {getStatusText(
                                                                    doc.status,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleDownloadDocument(
                                                                        doc.id,
                                                                    );
                                                                }}
                                                                disabled={
                                                                    downloadDocumentMutation.isPending
                                                                }
                                                            >
                                                                {downloadDocumentMutation.isPending ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Download className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleEditDocument(
                                                                        doc,
                                                                    );
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteDocument(
                                                                        doc.id,
                                                                    );
                                                                }}
                                                                disabled={
                                                                    deleteDocumentMutation.isPending
                                                                }
                                                            >
                                                                {deleteDocumentMutation.isPending ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <MoreVertical className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : null,
                                        )}
                                    </div>
                                </div>
                            ) : null,
                        );
                    })()}
                </>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing {filteredDocuments.length} of{' '}
                    {documents?.length || 0} documents
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button className="px-3 py-1 text-sm border border-blue-300 rounded-md bg-blue-50 text-blue-600">
                        1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                        2
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                        3
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                        ...
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                        13
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>

            {/* Preview Modal */}

            {/* UploadDialog for Editing Documents */}
            {showUploadDialog && documentToEdit && (
                <UploadDialog
                    isOpen={showUploadDialog}
                    onClose={() => {
                        setShowUploadDialog(false);
                        setDocumentToEdit(null);
                    }}
                    documentName={getDocumentDisplayName(documentToEdit)}
                    documentType={getDocumentFileType(documentToEdit)}
                    clientId={clientId}
                    businessId={businessId}
                    typeOfBusiness={typeOfBusiness}
                    editDocument={documentToEdit}
                >
                    <div style={{ display: 'none' }} />
                </UploadDialog>
            )}
        </div>
    );
}
