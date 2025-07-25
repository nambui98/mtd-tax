/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
    Search,
    Filter,
    Plus,
    Folder,
    Grid3X3,
    List,
    Clock,
    Eye,
    FileText,
    Trash,
    CloudUpload,
    Bot,
    X,
    Calendar,
    Receipt,
    File,
    FolderPlus,
    Bell,
    User,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize,
    Download,
    MoreVertical,
    Edit,
    Unlink,
    Check,
    FileImage,
    FileSpreadsheet,
    ArrowLeft,
    ArrowRight,
    Minus,
    Plus as PlusIcon,
    Upload,
    Loader2,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentTransaction, documentsService } from '@/services/documents';
import { uploadService, type FileValidationResult } from '@/services/upload';
import { toast } from 'sonner';
import { TypeOfBusiness } from '@/types/document';
import {
    MAPPING_HMRC_TO_TRANSACTION_CATEGORIES,
    TRANSACTION_CATEGORIES_FHL,
} from '@/constants/transaction';

type Props = {
    isOpen?: boolean;
    onClose?: () => void;
    documentName?: string;
    documentType?: 'pdf' | 'image' | 'excel' | 'default';
    children?: React.ReactNode;
    onFileUpload?: (file: File) => void;
    clientId?: string;
    businessId?: string;
    typeOfBusiness?: TypeOfBusiness;
    editDocument?: any; // Add support for editing existing documents
};

type TransactionCategory = {
    label: string;
    value: string;
    hmrcField: string;
    type: string;
};

type Transaction = {
    id: string;
    transactionDate: string;
    description: string;
    category: string;
    amount: number;
    status: string;
    isAIGenerated: boolean;
    type: string;
    aiConfidence?: number;
    currency?: string;
    notes?: string;
};

type UploadStatus =
    | 'idle'
    | 'validating'
    | 'uploading'
    | 'processing'
    | 'completed'
    | 'error';

type AddTransactionFormProps = {
    onSave: (transaction: any) => void;
    onCancel: () => void;
    transactionCategories: TransactionCategory[];
    clientId?: string;
    businessId?: string;
    documentId?: string;
};

function AddTransactionForm({
    onSave,
    onCancel,
    transactionCategories,
    clientId,
    businessId,
    documentId,
}: AddTransactionFormProps) {
    const [formData, setFormData] = useState({
        transactionDate: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
        type: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.category || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        const transaction = {
            documentId,
            clientId,
            businessId,
            transactionDate: formData.transactionDate,
            description: formData.description,
            category: formData.category,
            amount: parseFloat(formData.amount),
            currency: 'GBP',
            isAIGenerated: false,
            type: formData.type,
        };

        onSave(transaction);
    };

    return (
        <tr className="bg-gray-50 border-b border-gray-200">
            <td className="p-3 text-sm align-middle">
                <Input
                    type="date"
                    className="w-full text-sm"
                    value={formData.transactionDate}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            transactionDate: e.target.value,
                        })
                    }
                />
            </td>
            <td className="p-3 text-sm align-middle">
                <Input
                    type="text"
                    placeholder="Enter description"
                    className="w-full text-sm"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />
            </td>
            <td className="p-3 text-sm align-middle">
                <Select
                    value={formData.category}
                    onValueChange={(value) =>
                        setFormData({
                            ...formData,
                            category: value,
                            type:
                                transactionCategories.find(
                                    (cat) => cat.value === value,
                                )?.type || '',
                        })
                    }
                >
                    <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionCategories.map(
                            (category: TransactionCategory) => (
                                <SelectItem
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
            </td>
            <td className="p-3 text-sm align-middle">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        £
                    </span>
                    <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="w-full text-sm pl-6"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                    />
                </div>
            </td>
            <td className="p-3 text-sm align-middle text-center">
                <span className="inline-flex items-center text-xs font-medium text-blue-600">
                    New Transaction
                </span>
            </td>
            <td className="p-3 text-sm align-middle text-center">
                <div className="flex justify-center gap-1.5">
                    <Button
                        size="sm"
                        className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        <Check className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                        onClick={onCancel}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

type EditTransactionFormProps = {
    transaction: DocumentTransaction;
    onSave: (id: string, transaction: any) => void;
    onCancel: () => void;
    transactionCategories: TransactionCategory[];
};

function EditTransactionForm({
    transaction,
    onSave,
    onCancel,
    transactionCategories,
}: EditTransactionFormProps) {
    const [formData, setFormData] = useState({
        ...transaction,
        transactionDate: transaction.transactionDate,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.category || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        const updatedTransaction = {
            transactionDate: formData.transactionDate,
            description: formData.description,
            category: formData.category,
            amount: parseFloat(formData.amount),
            currency: transaction.currency || 'GBP',
            isAIGenerated: transaction.isAIGenerated || false,
            notes: transaction.notes,
        };

        onSave(transaction.id || '', updatedTransaction);
    };

    return (
        <tr className="bg-blue-50 border-b border-gray-200">
            <td className="p-3 text-sm align-middle">
                <Input
                    type="date"
                    className="w-full text-sm"
                    value={formData.transactionDate}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            transactionDate: e.target.value,
                        })
                    }
                />
            </td>
            <td className="p-3 text-sm align-middle">
                <Input
                    type="text"
                    placeholder="Enter description"
                    className="w-full text-sm"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />
            </td>
            <td className="p-3 text-sm align-middle">
                <Select
                    value={formData.category}
                    onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                    }
                >
                    <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionCategories.map(
                            (category: TransactionCategory) => (
                                <SelectItem
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
            </td>
            <td className="p-3 text-sm align-middle">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        £
                    </span>
                    <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="w-full text-sm pl-6"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                    />
                </div>
            </td>
            <td className="p-3 text-sm align-middle text-center">
                <span className="inline-flex items-center text-xs font-medium text-blue-600">
                    Editing
                </span>
            </td>
            <td className="p-3 text-sm align-middle text-center">
                <div className="flex justify-center gap-1.5">
                    <Button
                        size="sm"
                        className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        <Check className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                        onClick={onCancel}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function UploadDialog({
    isOpen,
    onClose,
    documentName = 'Document',
    documentType = 'default',
    children,
    onFileUpload,
    clientId,
    businessId,
    typeOfBusiness,
    editDocument,
}: Props) {
    const [isOpenDialog, setIsOpenDialog] = useState(isOpen || false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(2);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    // const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [tempTransactions, setTempTransactions] = useState<
        DocumentTransaction[]
    >([]);
    const [editingTransaction, setEditingTransaction] = useState<string | null>(
        null,
    );
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [validationResult, setValidationResult] =
        useState<FileValidationResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle edit mode - if editDocument is provided, we're in edit mode
    const isEditMode = !!editDocument;

    const transactionCategories = useMemo(
        () =>
            typeOfBusiness
                ? MAPPING_HMRC_TO_TRANSACTION_CATEGORIES[
                      typeOfBusiness as keyof typeof MAPPING_HMRC_TO_TRANSACTION_CATEGORIES
                  ]
                : [],
        [typeOfBusiness],
    );

    // Upload document mutation
    const {
        mutateAsync: uploadMutation,
        isPending: isUploading,
        isSuccess: isUploadSuccess,
        isError: isUploadError,
        data: uploadData,
    } = useMutation({
        mutationFn: async (file: File) => {
            if (!clientId) throw new Error('Client ID is required');
            setUploadStatus('uploading');
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
        onSuccess: () => {
            // setUploadStatus('processing');
            setUploadStatus('completed');
            setUploadProgress(100);
            toast.success('Document uploaded successfully');
            queryClient.invalidateQueries({
                queryKey: ['client-documents', clientId],
            });
            // Start processing
            // processDocument(data.documentId);
        },
        onError: (error: any) => {
            setUploadStatus('error');
            toast.error(`Upload failed: ${error.message}`);
        },
    });
    console.log('uploadData', uploadData);

    // Process document mutation
    const processMutation = useMutation({
        mutationFn: documentsService.processDocument,
        onSuccess: (data) => {
            toast.success('Document processing started');
            // Poll for processing status
            pollProcessingStatus(data.documentId);
        },
        onError: (error: any) => {
            toast.error(`Processing failed: ${error.message}`);
        },
    });

    // Get document transactions
    // const { data: documentTransactions, refetch: refetchTransactions } =
    //     useQuery({
    //         queryKey: ['document-transactions', uploadedDocument?.id],
    //         queryFn: () =>
    //             documentsService.getDocumentTransactions(uploadedDocument!.id),
    //         enabled: !!uploadedDocument?.id,
    //     });

    // Get document transactions for edit mode
    const { data: documentTransactions, refetch: refetchTransactions } =
        useQuery({
            queryKey: ['document-transactions', editDocument?.id],
            queryFn: () =>
                documentsService.getDocumentTransactions(editDocument!.id),
            enabled: !!editDocument?.id && isEditMode,
        });
    console.log('documentTransactions', documentTransactions);
    useEffect(() => {
        if (
            documentTransactions &&
            documentTransactions?.length > 0 &&
            isEditMode
        ) {
            setTempTransactions(documentTransactions);
        }
    }, [documentTransactions, isEditMode]);

    console.log('documentTransactions', documentTransactions);
    // Bulk create transactions mutation
    const createBulkTransactionsMutation = useMutation({
        mutationFn: ({
            documentId,
            transactions,
        }: {
            documentId: string;
            transactions: any[];
        }) => documentsService.createBulkTransactions(documentId, transactions),
        onSuccess: () => {
            toast.success('Transactions created successfully');
            // refetchTransactions();
        },
        onError: (error: any) => {
            toast.error(`Failed to create transactions: ${error.message}`);
        },
    });

    // Approve all transactions mutation
    const approveAllMutation = useMutation({
        mutationFn: documentsService.approveAllTransactions,
        onSuccess: (data) => {
            toast.success(`${data.approvedCount} transactions approved`);
            // refetchTransactions();
        },
        onError: (error: any) => {
            toast.error(`Failed to approve transactions: ${error.message}`);
        },
    });

    // Export transactions mutation
    const exportMutation = useMutation({
        mutationFn: ({
            documentId,
            format,
        }: {
            documentId: string;
            format: 'csv' | 'excel' | 'pdf';
        }) => documentsService.exportDocumentTransactions(documentId, format),
        onSuccess: (data) => {
            toast.success('Export completed');
            // In a real app, you would trigger a download
            console.log('Export data:', data);
        },
        onError: (error: any) => {
            toast.error(`Export failed: ${error.message}`);
        },
    });

    const queryClient = useQueryClient();

    const uploadDocumentWithTransactionsMutation = useMutation({
        mutationFn: ({
            clientId,
            businessId,
            documentUrl,
            transactions,
            documentId,
        }: {
            clientId: string;
            businessId: string;
            documentUrl: string;
            transactions: any[];
            documentId: string;
        }) => {
            debugger;
            if (isEditMode) {
                return documentsService.updateDocumentTransactions(
                    documentId,
                    transactions,
                );
            } else {
                if (!uploadData?.id) {
                    throw new Error('No document uploaded');
                }
                return documentsService.uploadDocumentWithTransactions({
                    clientId: clientId!,
                    businessId: businessId!,
                    documentUrl: uploadData.s3Url,
                    transactions: transactions,
                    documentId: uploadData.id,
                });
            }
        },
        onSuccess: () => {
            toast.success(
                isEditMode
                    ? 'Document transactions updated successfully'
                    : `${tempTransactions.length} transactions approved and saved to database`,
            );
            setIsOpenDialog(false);
            onClose?.();
            setTempTransactions([]);
            queryClient.invalidateQueries({
                queryKey: ['client-documents', clientId],
            });
        },
        onError: (error: any) => {
            toast.error(
                `Failed to upload document with transactions: ${error.message}`,
            );
        },
    });

    const handleFileUpload = async (file: File | undefined) => {
        if (file) {
            setUploadedFile(file);
            setUploadStatus('idle');
            setUploadProgress(0);
            setValidationResult(null);
            debugger;
            try {
                await uploadMutation(file);
            } catch (error) {
                console.error('Upload error:', error);
            }
        }
    };

    const processDocument = (documentId: string) => {
        processMutation.mutate(documentId);
    };

    const pollProcessingStatus = (documentId: string) => {
        const interval = setInterval(async () => {
            try {
                const status =
                    await documentsService.getDocumentProcessingStatus(
                        documentId,
                    );
                if (status.processingStatus === 'completed') {
                    setUploadStatus('completed');
                    clearInterval(interval);
                    // refetchTransactions();
                    toast.success('Document processing completed');
                } else if (status.processingStatus === 'error') {
                    setUploadStatus('error');
                    clearInterval(interval);
                    toast.error('Document processing failed');
                }
            } catch (error) {
                clearInterval(interval);
                setUploadStatus('error');
            }
        }, 2000);

        // Clear interval after 5 minutes
        setTimeout(() => {
            clearInterval(interval);
            setUploadStatus('error');
        }, 300000);
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

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0] || undefined);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const handleApproveAll = async () => {
        if (tempTransactions.length === 0) {
            toast.error('No temporary transactions to approve');
            return;
        }

        if (!uploadData?.id && !isEditMode) {
            toast.error('No document uploaded');
            return;
        }

        try {
            // Convert temp transactions to regular transactions format
            const transactionsToSave = tempTransactions.map((temp) => ({
                ...temp,
                id: temp.id?.includes('temp') ? null : temp.id,
                transactionDate: temp.transactionDate,
                description: temp.description,
                category: temp.category,
                amount: temp.amount,
                currency: temp.currency || 'GBP',
                isAIGenerated: temp.isAIGenerated || false,
                aiConfidence: temp.aiConfidence || 0,
                notes: temp.notes,
                type: temp.type,
            }));

            // Save to database using the new API endpoint
            uploadDocumentWithTransactionsMutation.mutate({
                clientId: clientId!,
                businessId: businessId!,
                documentUrl: uploadData?.s3Url || editDocument?.s3Url || '',
                transactions: transactionsToSave,
                documentId: editDocument?.id || uploadData?.id || '',
            });

            // Clear temp transactions
        } catch (error: any) {
            toast.error(`Failed to approve transactions: ${error.message}`);
        }
    };

    const handleEditTransaction = (transactionId: string) => {
        debugger;
        setEditingTransaction(transactionId);
    };

    const handleUpdateTransaction = (id: string, updatedTransaction: any) => {
        setTempTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id
                    ? {
                          ...transaction,
                          ...updatedTransaction,
                      }
                    : transaction,
            ),
        );
        setEditingTransaction(null);
        // toast.success('Transaction updated successfully');
    };

    const handleDeleteTransaction = (transactionId: string) => {
        setTempTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== transactionId),
        );
        toast.success('Transaction deleted successfully');
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    const handleAddTransaction = async (transaction: any) => {
        // Add to local temp transactions
        const newTempTransaction: DocumentTransaction = {
            id: `temp-${Date.now()}-${Math.random()}`,
            transactionDate: transaction.transactionDate,
            description: transaction.description,
            category: transaction.category,
            amount: transaction.amount,
            status: 'temp_pending',
            isAIGenerated: false,
            currency: transaction.currency || 'GBP',
            notes: transaction.notes,
            type: transaction.type,
            clientId: clientId!,
        };

        setTempTransactions((prev) => [newTempTransaction, ...prev]);
        // toast.success('Transaction added to temporary storage');
        setShowAddForm(false);
    };

    const handleExport = () => {
        if (uploadData?.s3Url) {
            exportMutation.mutate({
                documentId: uploadData.id,
                format: 'csv',
            });
        }
    };

    const getDocumentIcon = () => {
        switch (documentType) {
            case 'pdf':
                return <FileText className="w-16 h-16 text-red-600" />;
            case 'image':
                return <FileImage className="w-16 h-16 text-blue-600" />;
            case 'excel':
                return <FileSpreadsheet className="w-16 h-16 text-green-600" />;
            default:
                return <FileText className="w-16 h-16 text-gray-600" />;
        }
    };

    const getCategoryBadge = (categoryCode: string) => {
        const category = transactionCategories.find(
            (cat: TransactionCategory) => cat.value === categoryCode,
        );
        if (!category) {
            return (
                <Badge className="text-xs bg-gray-100 text-gray-800">
                    Unknown
                </Badge>
            );
        }

        const config = categoryMap[categoryCode] || {
            className: 'bg-gray-100 text-gray-800',
        };
        return (
            <Badge className={`text-xs ${config.className}`}>
                {category.label}
            </Badge>
        );
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<
            string,
            { label: string; className: string; dotColor: string }
        > = {
            verified: {
                label: 'Verified',
                className: 'text-green-700',
                dotColor: 'bg-green-500',
            },
            approved: {
                label: 'Approved',
                className: 'text-green-700',
                dotColor: 'bg-green-500',
            },
            pending: {
                label: 'Pending',
                className: 'text-yellow-700',
                dotColor: 'bg-yellow-500',
            },
            temp_pending: {
                label: 'Temp Pending',
                className: 'text-blue-700',
                dotColor: 'bg-blue-500',
            },
            needs_review: {
                label: 'Needs Review',
                className: 'text-yellow-700',
                dotColor: 'bg-yellow-500',
            },
            needs_category: {
                label: 'Needs Category',
                className: 'text-red-700',
                dotColor: 'bg-red-500',
            },
            rejected: {
                label: 'Rejected',
                className: 'text-red-700',
                dotColor: 'bg-red-500',
            },
        };

        const config = statusMap[status] || {
            label: status,
            className: 'text-gray-700',
            dotColor: 'bg-gray-500',
        };
        return (
            <span
                className={`flex items-center text-xs font-medium ${config.className}`}
            >
                <span
                    className={`w-2 h-2 rounded-full ${config.dotColor} mr-1.5`}
                ></span>
                {config.label}
            </span>
        );
    };

    const formatAmount = (amount: number) => {
        const isNegative = amount < 0;
        const formattedAmount = Math.abs(amount).toFixed(2);
        const color = isNegative ? 'text-red-600' : 'text-green-600';
        const prefix = isNegative ? '-' : '';
        return (
            <span className={`font-medium ${color}`}>
                {prefix}£{formattedAmount}
            </span>
        );
    };

    const getUploadStatusIcon = () => {
        switch (uploadStatus) {
            case 'validating':
                return (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                );
            case 'uploading':
                return <Upload className="w-6 h-6 text-blue-600" />;
            case 'processing':
                return (
                    <Bot className="w-6 h-6 animate-pulse text-purple-600" />
                );
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-600" />;
            default:
                return <CloudUpload className="w-6 h-6 text-gray-600" />;
        }
    };

    const getUploadStatusText = () => {
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

    const handleZoomIn = () => setCurrentZoom(Math.min(currentZoom + 0.1, 2));
    const handleZoomOut = () =>
        setCurrentZoom(Math.max(currentZoom - 0.1, 0.5));
    const handlePreviousPage = () =>
        setCurrentPage(Math.max(currentPage - 1, 1));
    const handleNextPage = () =>
        setCurrentPage(Math.min(currentPage + 1, totalPages));

    // Update transactions when document transactions or temp transactions change
    // useEffect(() => {
    //     const allTransactions = [
    //         ...(documentTransactions || []),
    //         ...tempTransactions.map((temp) => ({
    //             ...temp,
    //             isTemp: true,
    //             status: 'temp_pending',
    //         })),
    //     ];
    //     setTransactions(allTransactions);
    // }, [documentTransactions, tempTransactions]);

    return (
        <Dialog
            open={isOpenDialog}
            onOpenChange={(open) => {
                setIsOpenDialog(open);
                onClose?.();
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-7xl md:max-w-[1400px] max-h-[90vh] overflow-hidden p-0 space-y-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-2.5" />
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {editDocument
                                    ? 'Edit Document'
                                    : 'Extracted Transactions'}
                            </DialogTitle>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-5">
                                <span className="font-medium text-gray-900">
                                    {editDocument
                                        ? editDocument.originalFileName ||
                                          editDocument.fileName ||
                                          'Document'
                                        : uploadedFile
                                          ? uploadedFile.name
                                          : documentName}
                                </span>
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex h-[calc(90vh-80px)]">
                    {/* Document Preview Panel */}
                    <div className="w-2/5 border-r border-gray-200 flex flex-col">
                        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center h-16">
                            <div className="text-sm font-medium text-gray-900">
                                Document Preview
                            </div>
                            <div className="flex gap-2.5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleZoomOut}
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleZoomIn}
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Maximize className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto relative">
                            {!uploadedFile && !isEditMode ? (
                                <div
                                    className={`w-[90%] h-[95%] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                                        isDragOver
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleClickUpload}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {uploadStatus !== 'idle' ? (
                                        <div className="text-center">
                                            {getUploadStatusIcon()}
                                            <p className="text-lg font-medium text-gray-900 mb-2 mt-4">
                                                {getUploadStatusText()}
                                            </p>
                                            {uploadStatus === 'uploading' && (
                                                <div className="w-full max-w-xs mt-4">
                                                    <Progress
                                                        value={uploadProgress}
                                                        className="w-full"
                                                    />
                                                </div>
                                            )}
                                            {validationResult &&
                                                validationResult.warnings
                                                    .length > 0 && (
                                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                        <div className="flex items-center">
                                                            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                                                            <span className="text-sm text-yellow-800">
                                                                {
                                                                    validationResult
                                                                        .warnings[0]
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <>
                                            <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
                                            <div className="text-center">
                                                <p className="text-lg font-medium text-gray-900 mb-2">
                                                    {isDragOver
                                                        ? 'Drop your file here'
                                                        : 'Upload Document'}
                                                </p>
                                                <p className="text-sm text-gray-500 mb-4">
                                                    {isDragOver
                                                        ? 'Release to upload'
                                                        : 'Drag and drop your file here, or click to browse'}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClickUpload();
                                                    }}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Choose File
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                                        onChange={handleFileInputChange}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="bg-white w-[90%] h-[95%] shadow-sm relative"
                                    style={{
                                        transform: `scale(${currentZoom})`,
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-400 w-full">
                                        {isEditMode ? (
                                            <>
                                                {getDocumentIcon()}
                                                <div className="text-sm mt-4">
                                                    {editDocument.originalFileName ||
                                                        editDocument.fileName ||
                                                        'Document'}{' '}
                                                    Preview
                                                </div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    File size:{' '}
                                                    {editDocument.fileSize
                                                        ? uploadService.formatFileSize(
                                                              editDocument.fileSize,
                                                          )
                                                        : 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Uploaded:{' '}
                                                    {editDocument.uploadedAt
                                                        ? new Date(
                                                              editDocument.uploadedAt,
                                                          ).toLocaleDateString()
                                                        : 'Unknown'}
                                                </div>
                                                {editDocument.documentType &&
                                                    editDocument.documentType
                                                        .length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                                                            {editDocument.documentType.map(
                                                                (
                                                                    type: string,
                                                                    index: number,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                                                    >
                                                                        {type}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                            </>
                                        ) : (
                                            <>
                                                {getDocumentIcon()}
                                                <div className="text-sm mt-4">
                                                    {uploadedFile?.name ||
                                                        'Document'}{' '}
                                                    Preview
                                                </div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    File size:{' '}
                                                    {uploadedFile
                                                        ? uploadService.formatFileSize(
                                                              uploadedFile.size,
                                                          )
                                                        : 'Unknown'}
                                                </div>
                                                {isUploading && (
                                                    <div className="w-full max-w-xs mt-4">
                                                        <Progress
                                                            value={
                                                                uploadProgress
                                                            }
                                                            className="w-full"
                                                        />
                                                    </div>
                                                )}
                                                {uploadStatus ===
                                                    'processing' && (
                                                    <div className="mt-4 flex items-center text-purple-600">
                                                        <Bot className="w-4 h-4 animate-pulse mr-2" />
                                                        Processing with AI...
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                            <div className="text-xs text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Panel */}
                    <div className="w-3/5 flex flex-col">
                        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center h-16">
                            <div className="text-sm font-medium text-gray-900">
                                <span className="text-blue-600 font-semibold">
                                    {isEditMode
                                        ? documentTransactions?.length || 0
                                        : transactions.length}
                                </span>{' '}
                                Transactions Extracted
                                {tempTransactions.length > 0 && (
                                    <span className="text-orange-600 font-semibold ml-2">
                                        ({tempTransactions.length} temp)
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="text-xs px-3 py-1.5"
                                >
                                    <PlusIcon className="w-3 h-3 mr-1" />
                                    Add Transaction
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs px-3 py-1.5"
                                    onClick={handleExport}
                                    disabled={exportMutation.isPending}
                                >
                                    {exportMutation.isPending ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                        <Download className="w-3 h-3 mr-1" />
                                    )}
                                    Export
                                </Button>
                                <Button
                                    size="sm"
                                    className="text-xs px-3 py-1.5"
                                    onClick={handleApproveAll}
                                    disabled={
                                        uploadDocumentWithTransactionsMutation.isPending ||
                                        tempTransactions.length === 0
                                    }
                                >
                                    {uploadDocumentWithTransactionsMutation.isPending ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                        <Check className="w-3 h-3 mr-1" />
                                    )}
                                    {isEditMode
                                        ? 'Save Changes'
                                        : `Approve All (${tempTransactions.length})`}
                                </Button>
                                {!isEditMode && tempTransactions.length > 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs px-3 py-1.5"
                                        onClick={() => {
                                            setTempTransactions([]);
                                            toast.success(
                                                'Temporary transactions cleared',
                                            );
                                        }}
                                    >
                                        <Trash className="w-3 h-3 mr-1" />
                                        Clear Temp
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                    <tr>
                                        <th className="text-left p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Date
                                        </th>
                                        <th className="text-left p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Description
                                        </th>
                                        <th className="text-left p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Category
                                        </th>
                                        <th className="text-right p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Amount
                                        </th>
                                        <th className="text-center p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Status
                                        </th>
                                        <th className="text-center p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Add Transaction Form Row */}
                                    {showAddForm && (
                                        <AddTransactionForm
                                            onSave={handleAddTransaction}
                                            onCancel={() =>
                                                setShowAddForm(false)
                                            }
                                            transactionCategories={
                                                transactionCategories
                                            }
                                            clientId={clientId}
                                            businessId={businessId}
                                            documentId={uploadData?.id}
                                        />
                                    )}
                                    {tempTransactions.map((transaction) => (
                                        <React.Fragment key={transaction.id}>
                                            {editingTransaction ===
                                            transaction.id ? (
                                                <EditTransactionForm
                                                    transaction={transaction}
                                                    onSave={
                                                        handleUpdateTransaction
                                                    }
                                                    onCancel={handleCancelEdit}
                                                    transactionCategories={
                                                        transactionCategories
                                                    }
                                                />
                                            ) : (
                                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="p-3 text-sm align-middle">
                                                        {new Date(
                                                            transaction.transactionDate,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 text-sm align-middle font-medium">
                                                        {
                                                            transaction.description
                                                        }
                                                    </td>
                                                    <td className="p-3 text-sm align-middle">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {getCategoryBadge(
                                                                transaction.category,
                                                            )}
                                                            {transaction.isAIGenerated && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs bg-blue-100 text-blue-800"
                                                                >
                                                                    <Bot className="w-2.5 h-2.5 mr-1" />
                                                                    AI Generated
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm align-middle text-right font-medium">
                                                        {formatAmount(
                                                            transaction.amount,
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-sm align-middle text-center">
                                                        {getStatusBadge(
                                                            transaction.status,
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-sm align-middle text-center">
                                                        <div className="flex justify-center gap-1.5">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-8 h-8 p-0"
                                                                onClick={() =>
                                                                    handleEditTransaction(
                                                                        transaction.id ??
                                                                            '',
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-8 h-8 p-0"
                                                                onClick={() =>
                                                                    handleDeleteTransaction(
                                                                        transaction.id ||
                                                                            '',
                                                                    )
                                                                }
                                                            >
                                                                <Trash className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const categoryMap: Record<string, { className: string }> = {
    // Self-Employment Income Categories
    turnover: { className: 'bg-purple-100 text-purple-800' },
    otherIncome: { className: 'bg-purple-100 text-purple-800' },
    taxTakenOffTradingIncome: {
        className: 'bg-purple-100 text-purple-800',
    },

    // Self-Employment Expense Categories
    costOfGoods: { className: 'bg-red-100 text-red-800' },
    paymentsToSubcontractors: { className: 'bg-red-100 text-red-800' },
    wagesAndStaffCosts: { className: 'bg-red-100 text-red-800' },
    carVanTravelExpenses: { className: 'bg-red-100 text-red-800' },
    premisesRunningCosts: { className: 'bg-red-100 text-red-800' },
    maintenanceCosts: { className: 'bg-red-100 text-red-800' },
    adminCosts: { className: 'bg-red-100 text-red-800' },
    businessEntertainmentCosts: {
        className: 'bg-red-100 text-red-800',
    },
    advertisingCosts: { className: 'bg-red-100 text-red-800' },
    interestOnBankOtherLoans: { className: 'bg-red-100 text-red-800' },
    financeCharges: { className: 'bg-red-100 text-red-800' },
    irrecoverableDebts: { className: 'bg-red-100 text-red-800' },
    professionalFees: { className: 'bg-red-100 text-red-800' },
    depreciation: { className: 'bg-red-100 text-red-800' },
    otherExpenses: { className: 'bg-red-100 text-red-800' },

    // Self-Employment Disallowable Expense Categories
    costOfGoodsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    paymentsToSubcontractorsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    wagesAndStaffCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    carVanTravelExpensesDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    premisesRunningCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    maintenanceCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    adminCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    businessEntertainmentCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    advertisingCostsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    interestOnBankOtherLoansDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    financeChargesDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    irrecoverableDebtsDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    professionalFeesDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    depreciationDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },
    otherExpensesDisallowable: {
        className: 'bg-orange-100 text-orange-800',
    },

    // UK FHL Income Categories
    period_amount: { className: 'bg-purple-100 text-purple-800' },
    tax_deducted: { className: 'bg-purple-100 text-purple-800' },
    rent_a_room_rents_received: {
        className: 'bg-purple-100 text-purple-800',
    },

    // UK FHL Expense Categories
    premises_running_costs: { className: 'bg-red-100 text-red-800' },
    repairs_and_maintenance: { className: 'bg-red-100 text-red-800' },
    financial_costs: { className: 'bg-red-100 text-red-800' },
    professional_fees: { className: 'bg-red-100 text-red-800' },
    cost_of_services: { className: 'bg-red-100 text-red-800' },
    other: { className: 'bg-red-100 text-red-800' },
    travel_costs: { className: 'bg-red-100 text-red-800' },
    rent_a_room_amount_claimed: {
        className: 'bg-red-100 text-red-800',
    },

    // UK Non-FHL Income Categories
    premiums_of_lease_grant: {
        className: 'bg-purple-100 text-purple-800',
    },
    reverse_premiums: { className: 'bg-purple-100 text-purple-800' },
    non_fhl_period_amount: {
        className: 'bg-purple-100 text-purple-800',
    },
    non_fhl_tax_deducted: {
        className: 'bg-purple-100 text-purple-800',
    },
    other_income: { className: 'bg-purple-100 text-purple-800' },
    non_fhl_rent_a_room_rents_received: {
        className: 'bg-purple-100 text-purple-800',
    },

    // UK Non-FHL Expense Categories
    non_fhl_premises_running_costs: {
        className: 'bg-red-100 text-red-800',
    },
    non_fhl_repairs_and_maintenance: {
        className: 'bg-red-100 text-red-800',
    },
    non_fhl_financial_costs: { className: 'bg-red-100 text-red-800' },
    non_fhl_professional_fees: { className: 'bg-red-100 text-red-800' },
    non_fhl_cost_of_services: { className: 'bg-red-100 text-red-800' },
    non_fhl_other: { className: 'bg-red-100 text-red-800' },
    residential_financial_cost: {
        className: 'bg-red-100 text-red-800',
    },
    non_fhl_travel_costs: { className: 'bg-red-100 text-red-800' },
    residential_financial_costs_carried_forward: {
        className: 'bg-red-100 text-red-800',
    },
    non_fhl_rent_a_room_amount_claimed: {
        className: 'bg-red-100 text-red-800',
    },

    // Foreign FHL Income Categories
    foreign_fhl_rent_amount: {
        className: 'bg-purple-100 text-purple-800',
    },

    // Foreign FHL Expense Categories
    foreign_fhl_premises_running_costs: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_fhl_repairs_and_maintenance: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_fhl_financial_costs: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_fhl_professional_fees: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_fhl_cost_of_services: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_fhl_travel_costs: { className: 'bg-red-100 text-red-800' },
    foreign_fhl_other: { className: 'bg-red-100 text-red-800' },

    // Foreign Non-FHL Income Categories
    foreign_non_fhl_rent_amount: {
        className: 'bg-purple-100 text-purple-800',
    },
    foreign_tax_credit_relief: {
        className: 'bg-purple-100 text-purple-800',
    },
    foreign_premiums_of_lease_grant: {
        className: 'bg-purple-100 text-purple-800',
    },
    foreign_other_property_income: {
        className: 'bg-purple-100 text-purple-800',
    },
    foreign_tax_paid_or_deducted: {
        className: 'bg-purple-100 text-purple-800',
    },
    foreign_special_withholding_tax_or_uk_tax_paid: {
        className: 'bg-purple-100 text-purple-800',
    },

    // Foreign Non-FHL Expense Categories
    foreign_non_fhl_premises_running_costs: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_repairs_and_maintenance: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_financial_costs: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_professional_fees: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_cost_of_services: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_travel_costs: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_residential_financial_cost: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_brought_forward_residential_financial_cost: {
        className: 'bg-red-100 text-red-800',
    },
    foreign_non_fhl_other: { className: 'bg-red-100 text-red-800' },

    // Legacy categories (for backward compatibility)
    SALES_INCOME: { className: 'bg-purple-100 text-purple-800' },
    CONSULTING_INCOME_LEGACY: {
        className: 'bg-purple-100 text-purple-800',
    },
    PROPERTY_INCOME: { className: 'bg-purple-100 text-purple-800' },
    INTEREST_INCOME: { className: 'bg-purple-100 text-purple-800' },
    OTHER_INCOME: { className: 'bg-purple-100 text-purple-800' },
    SOFTWARE_SUBSCRIPTIONS: { className: 'bg-red-100 text-red-800' },
    TRAVEL_TRANSPORT: { className: 'bg-red-100 text-red-800' },
    MARKETING_ADVERTISING: { className: 'bg-red-100 text-red-800' },
    MAINTENANCE_REPAIRS: { className: 'bg-red-100 text-red-800' },
    TRAINING_DEVELOPMENT: { className: 'bg-red-100 text-red-800' },
    RENT: { className: 'bg-red-100 text-red-800' },
    SALARIES_WAGES: { className: 'bg-red-100 text-red-800' },
    PENSION_CONTRIBUTIONS: { className: 'bg-red-100 text-red-800' },
    NATIONAL_INSURANCE: { className: 'bg-red-100 text-red-800' },
};
