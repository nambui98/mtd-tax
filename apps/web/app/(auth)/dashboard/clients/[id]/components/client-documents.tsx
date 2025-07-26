'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
    ChevronDown,
    ChevronUp,
    ArrowUp,
    ArrowDown,
    TrendingUp,
    History,
    Info,
    ClipboardList,
    Download as DownloadIcon,
    Trash,
    CloudUpload,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import UploadDialog from '@/app/(auth)/dashboard/documents/components/upload-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    documentsService,
    DocumentFilters,
    DocumentStatistics,
} from '@/services/documents';
import { toast } from 'sonner';
import { TypeOfBusiness } from '@/types/document';
import { Input } from '@workspace/ui/components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { format } from 'date-fns';
import ConfirmDeletePopover from '@/components/confirm-delete-popover';
import { uploadService } from '@/services/upload';
import { cn } from '@workspace/ui/lib/utils';
import { Progress } from '@workspace/ui/components/progress';

type Props = {
    clientId: string;
    businessId: string;
    typeOfBusiness?: TypeOfBusiness;
};

type FilterState = {
    search: string;
    documentType: string;
    status: string;
    processingStatus: string;
    businessId: string;
    dateFrom: string;
    dateTo: string;
    fileSizeMin: string;
    fileSizeMax: string;
    aiExtractedTransactionsMin: string;
    aiAccuracyMin: string;
};

export default function ClientDocuments({
    clientId,
    businessId,
    typeOfBusiness,
}: Props) {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        documentType: 'all',
        status: 'all',
        processingStatus: 'all',
        businessId: '',
        dateFrom: '',
        dateTo: '',
        fileSizeMin: '',
        fileSizeMax: '',
        aiExtractedTransactionsMin: '',
        aiAccuracyMin: '',
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('uploadedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<any>(null);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [showRemoteDocuments, setShowRemoteDocuments] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    // Convert filters to API format
    const apiFilters: DocumentFilters = useMemo(
        () => ({
            clientId,
            documentType:
                filters.documentType === 'all' ? '' : filters.documentType,
            status: filters.status === 'all' ? '' : filters.status,
            processingStatus:
                filters.processingStatus === 'all'
                    ? ''
                    : filters.processingStatus,
            businessId: filters.businessId || undefined,
            search: filters.search || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            fileSizeMin: filters.fileSizeMin
                ? parseInt(filters.fileSizeMin)
                : undefined,
            fileSizeMax: filters.fileSizeMax
                ? parseInt(filters.fileSizeMax)
                : undefined,
            aiExtractedTransactionsMin: filters.aiExtractedTransactionsMin
                ? parseInt(filters.aiExtractedTransactionsMin)
                : undefined,
            aiAccuracyMin: filters.aiAccuracyMin
                ? parseFloat(filters.aiAccuracyMin)
                : undefined,
            page: currentPage,
            limit: 10,
            sortBy,
            sortOrder,
        }),
        [filters, currentPage, sortBy, sortOrder, clientId],
    );

    // Statistics filters
    const statisticsFilters = useMemo(
        () => ({
            clientId,
            businessId: filters.businessId || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            documentType:
                filters.documentType === 'all'
                    ? undefined
                    : filters.documentType,
            status: filters.status === 'all' ? undefined : filters.status,
        }),
        [filters, clientId],
    );

    // Queries
    const { data: statistics, isLoading: isLoadingStats } = useQuery({
        queryKey: ['document-statistics', clientId, statisticsFilters],
        queryFn: () =>
            documentsService.getDocumentStatistics(statisticsFilters),
        enabled: !!clientId,
    });

    const {
        data: documentsData,
        isLoading: isLoadingDocuments,
        refetch: refetchDocuments,
    } = useQuery({
        queryKey: ['filtered-documents', clientId, apiFilters],
        queryFn: () => documentsService.getFilteredDocuments(apiFilters),
        enabled: !!clientId,
    });

    const { data: categories } = useQuery({
        queryKey: ['document-categories', clientId],
        queryFn: () => documentsService.getDocumentCategories(clientId),
        enabled: !!clientId,
    });

    const { data: businesses } = useQuery({
        queryKey: ['document-businesses', clientId],
        queryFn: () => documentsService.getDocumentBusinesses(clientId),
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

    // Mutations
    const refreshQueries = useMutation({
        mutationFn: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['document-statistics', clientId],
            });
            await queryClient.invalidateQueries({
                queryKey: ['filtered-documents', clientId],
            });
        },
    });

    // Delete document mutation
    const deleteDocumentMutation = useMutation({
        mutationFn: (documentId: string) =>
            documentsService.deleteDocument(documentId),
        onSuccess: () => {
            toast.success('Document deleted successfully');
            refreshQueries.mutate();
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
            refreshQueries.mutate();
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

    const {
        mutateAsync: uploadMutation,
        isPending: isUploading,
        isSuccess: isUploadSuccess,
        isError: isUploadError,
        data: uploadData,
        error: uploadError,
        reset: resetUpload,
    } = useMutation({
        mutationFn: async (file: File) => {
            if (!clientId) throw new Error('Client ID is required');
            return uploadService.uploadDocument(
                file,
                {
                    clientId,
                    businessId: businessId!,
                },
                (progress) => {
                    setUploadProgress(progress);
                },
            );
        },
        onSuccess: (data) => {
            setUploadProgress(100);
            setShowUploadDialog(true);
            setDocumentToEdit(data);
            refetchDocuments();
            refreshQueries.mutate();
            toast.success('Document uploaded successfully');
            queryClient.invalidateQueries({
                queryKey: ['client-documents', clientId],
            });
            queryClient.invalidateQueries({
                queryKey: ['transaction-statistics', clientId],
            });
            queryClient.invalidateQueries({
                queryKey: ['filtered-transactions', clientId],
            });
        },
        onError: (error: any) => {
            toast.error(`Upload failed: ${error.message}`);
        },
    });

    // Handlers
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            documentType: 'all',
            status: 'all',
            processingStatus: 'all',
            businessId: '',
            dateFrom: '',
            dateTo: '',
            fileSizeMin: '',
            fileSizeMax: '',
            aiExtractedTransactionsMin: '',
            aiAccuracyMin: '',
        });
        setCurrentPage(1);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleDeleteDocument = (documentId: string) => {
        deleteDocumentMutation.mutate(documentId);
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
    const handleFileUpload = async (file: File | undefined) => {
        if (file) {
            setUploadedFile(file);
            setUploadProgress(0);
            try {
                await uploadMutation(file);
            } catch (error) {
                console.error('Upload error:', error);
            }
        }
    };
    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0] || undefined);
        }
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0] || undefined);
        }
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
                                    {statistics?.summary.totalDocuments || 0}
                                </span>{' '}
                                documents processed
                            </div>
                            <div>
                                <span className="font-semibold">
                                    {statistics?.summary.totalTransactions || 0}
                                </span>{' '}
                                transactions extracted
                            </div>
                            <div>
                                <span className="font-semibold">
                                    {statistics?.summary.averageAccuracy
                                        ? `${(statistics.summary.averageAccuracy * 100).toFixed(0)}%`
                                        : '95%'}
                                </span>{' '}
                                accuracy rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : statistics?.summary.totalDocuments || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1" />
                        Total Documents
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : formatFileSize(
                                  statistics?.summary.totalFileSize || 0,
                              )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Total Size
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : statistics?.summary.totalTransactions || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <ClipboardList className="w-4 h-4 mr-1" />
                        Transactions
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : `${((statistics?.summary.averageAccuracy || 0) * 100).toFixed(0)}%`}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        AI Accuracy
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div
                className={cn(
                    'border-2 cursor-pointer border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-gray-50 transition-colors',
                    {
                        'border-blue-500 bg-blue-50': isDragOver,
                    },
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickUpload}
            >
                {uploadProgress !== 0 ? (
                    <div className="text-center flex flex-col items-center justify-center">
                        {getUploadStatusIcon(
                            isUploading
                                ? 'uploading'
                                : isUploadError
                                  ? 'error'
                                  : isUploadSuccess
                                    ? 'completed'
                                    : '',
                        )}
                        <p className="text-lg font-medium text-gray-900 mb-2 mt-4">
                            {getUploadStatusText(
                                isUploading
                                    ? 'uploading'
                                    : isUploadError
                                      ? 'error'
                                      : isUploadSuccess
                                        ? 'completed'
                                        : '',
                                uploadProgress,
                            )}
                        </p>
                        {/* {isUploading && ( */}
                        <div className="w-full max-w-xs mt-4 mx-auto">
                            <Progress
                                value={uploadProgress}
                                className="w-full"
                            />
                        </div>
                        {/* )} */}
                        {isUploadError && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                    <span className="text-sm text-yellow-800">
                                        {uploadError?.message ||
                                            'Upload failed'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
                        <div className="text-center">
                            <div className="text-gray-900 font-medium mb-2">
                                Drag & drop documents here or click to browse
                            </div>
                            <div className="text-gray-600 text-sm max-w-md mx-auto">
                                Upload receipts, invoices, bank statements, and
                                other financial documents. Our AI will
                                automatically extract transaction data and
                                suggest categorizations.
                            </div>

                            <Button
                                variant="default"
                                size="sm"
                                className="text-sm mt-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickUpload();
                                }}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                            </Button>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                    onChange={handleFileInputChange}
                />
            </div>

            {/* Document Filters and Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3 flex-1">
                    <div className="flex-1 min-w-48 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                handleFilterChange('search', e.target.value)
                            }
                            className="pl-10 pr-3 py-2 h-[42px]"
                            placeholder="Search documents..."
                        />
                    </div>

                    {/* Document Type Filter */}
                    <div>
                        <Select
                            value={filters.documentType}
                            onValueChange={(value) =>
                                handleFilterChange('documentType', value)
                            }
                        >
                            <SelectTrigger className="w-full text-sm py-5">
                                <SelectValue placeholder="All Document Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Document Types
                                </SelectItem>
                                <SelectItem value="receipt">
                                    Receipts
                                </SelectItem>
                                <SelectItem value="invoice">
                                    Invoices
                                </SelectItem>
                                <SelectItem value="bank statement">
                                    Bank Statements
                                </SelectItem>
                                <SelectItem value="tax document">
                                    Tax Documents
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <Select
                            value={filters.status}
                            onValueChange={(value) =>
                                handleFilterChange('status', value)
                            }
                        >
                            <SelectTrigger className="w-full text-sm py-5">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="uploaded">
                                    Uploaded
                                </SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="processed">
                                    Processed
                                </SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    {(filters.search ||
                        filters.documentType !== 'all' ||
                        filters.status !== 'all') && (
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            size="lg"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
                <div className="flex gap-3 ml-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() =>
                            setShowAdvancedFilters(!showAdvancedFilters)
                        }
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        {showAdvancedFilters ? 'Hide' : 'Advanced'} Filters
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

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date From
                            </label>
                            <Input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'dateFrom',
                                        e.target.value,
                                    )
                                }
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date To
                            </label>
                            <Input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) =>
                                    handleFilterChange('dateTo', e.target.value)
                                }
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min File Size (MB)
                            </label>
                            <Input
                                type="number"
                                value={filters.fileSizeMin}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'fileSizeMin',
                                        e.target.value,
                                    )
                                }
                                placeholder="0"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max File Size (MB)
                            </label>
                            <Input
                                type="number"
                                value={filters.fileSizeMax}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'fileSizeMax',
                                        e.target.value,
                                    )
                                }
                                placeholder="100"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

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
                                        <Button
                                            variant="outline"
                                            size="icon"
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
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoadingDocuments ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                        Loading documents...
                    </span>
                </div>
            ) : documentsData?.documents?.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents found</p>
                </div>
            ) : (
                <>
                    {/* Dynamic Document Groups by Month */}
                    {(() => {
                        const groupedDocuments = groupDocumentsByMonth(
                            documentsData?.documents || [],
                        );
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
                                                                doc.fileType,
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 mb-1">
                                                                {
                                                                    doc.originalFileName
                                                                }
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
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
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
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
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
                                                            </Button>
                                                            <ConfirmDeletePopover
                                                                title="Delete Document"
                                                                description="Are you sure you want to delete this document? This action cannot be undone."
                                                                isLoading={
                                                                    deleteDocumentMutation.isPending &&
                                                                    deleteDocumentMutation.variables ===
                                                                        doc.id
                                                                }
                                                                isSuccess={
                                                                    deleteDocumentMutation.isSuccess
                                                                }
                                                                onConfirm={() =>
                                                                    handleDeleteDocument(
                                                                        doc.id,
                                                                    )
                                                                }
                                                            >
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    disabled={
                                                                        deleteDocumentMutation.isPending
                                                                    }
                                                                >
                                                                    {deleteDocumentMutation.isPending &&
                                                                    deleteDocumentMutation.variables ===
                                                                        doc.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </ConfirmDeletePopover>
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
                    Showing {documentsData?.documents?.length} of{' '}
                    {documentsData?.pagination?.total || 0} documents
                </div>
                {/* Pagination Controls */}
                {documentsData?.pagination?.totalPages &&
                    documentsData.pagination.totalPages > 1 && (
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            {/* Page numbers */}
                            {Array.from(
                                { length: documentsData.pagination.totalPages },
                                (_, i) => i + 1,
                            )
                                .filter((page) => {
                                    // Show first, last, current, and neighbors
                                    if (
                                        page === 1 ||
                                        page ===
                                            documentsData.pagination
                                                .totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    ) {
                                        return true;
                                    }
                                    // Show ellipsis only once for skipped ranges
                                    if (
                                        (page === currentPage - 2 &&
                                            page > 1) ||
                                        (page === currentPage + 2 &&
                                            page <
                                                documentsData.pagination
                                                    .totalPages)
                                    ) {
                                        return true;
                                    }
                                    return false;
                                })
                                .map((page, idx, arr) => {
                                    // Insert ellipsis for skipped pages
                                    if (
                                        idx > 0 &&
                                        page - (arr[idx - 1] || 0) > 1
                                    ) {
                                        return (
                                            <span
                                                key={`ellipsis-${page}`}
                                                className="px-2 text-gray-400"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={page}
                                            variant={
                                                page === currentPage
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            disabled={page === currentPage}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    currentPage ===
                                    documentsData.pagination.totalPages
                                }
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
            </div>

            {/* Preview Modal */}

            {/* UploadDialog for Editing Documents */}
            {showUploadDialog && documentToEdit && (
                <UploadDialog
                    isOpen={showUploadDialog}
                    onClose={() => {
                        setShowUploadDialog(false);
                        setDocumentToEdit(null);
                        resetUpload();
                        setUploadProgress(0);
                    }}
                    documentName={documentToEdit.originalFileName}
                    documentType={documentToEdit.fileType}
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

// Helper functions
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
        case 'completed':
            return 'bg-green-500';
        case 'pending':
        case 'processing':
            return 'bg-yellow-500';
        case 'error':
        case 'failed':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'processed':
        case 'completed':
            return 'Processed';
        case 'pending':
        case 'processing':
            return 'Processing';
        case 'error':
        case 'failed':
            return 'Error';
        default:
            return 'Unknown';
    }
};

const getStatusTextColor = (status: string) => {
    switch (status) {
        case 'processed':
        case 'completed':
            return 'text-green-700';
        case 'pending':
        case 'processing':
            return 'text-yellow-700';
        case 'error':
        case 'failed':
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

const getUploadStatusIcon = (uploadStatus: string) => {
    switch (uploadStatus) {
        case 'validating':
            return <Loader2 className="w-12 h-12 animate-spin text-blue-600" />;
        case 'uploading':
            return <Upload className="w-12 h-12 text-blue-600" />;
        case 'processing':
            return <Bot className="w-12 h-12 animate-pulse text-purple-600" />;
        case 'completed':
            return <CheckCircle className="w-12 h-12 text-green-600" />;
        case 'error':
            return <AlertCircle className="w-12 h-12 text-red-600" />;
        default:
            return <CloudUpload className="w-12 h-12 text-gray-600" />;
    }
};

const getUploadStatusText = (uploadStatus: string, uploadProgress: number) => {
    switch (uploadStatus) {
        case 'validating':
            return 'Validating file...';
        case 'uploading':
            return `Uploading... ${uploadProgress}%`;
        case 'processing':
            return 'Processing with AI...';
        case 'completed':
            return 'Upload completed';
        case 'error':
            return 'Upload failed';
        default:
            return 'Ready to upload';
    }
};
