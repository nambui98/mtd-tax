'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Progress } from '@workspace/ui/components/progress';
import {
    Upload,
    FileText,
    FileImage,
    FileSpreadsheet,
    Folder,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Download,
    Trash,
    Plus,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Bot,
    CloudUpload,
    FolderPlus,
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import {
    documentsService,
    type Document,
    type DocumentTransaction,
    type DocumentStats,
} from '@/services/documents';
import { hmrcService } from '@/services/hmrc';
import UploadDialog from './upload-dialog';
import { format } from 'date-fns';

export default function DocumentsContent() {
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedFolder, setSelectedFolder] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null,
    );
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const queryClient = useQueryClient();

    // Fetch documents
    const { data: documents = [], isLoading: documentsLoading } = useQuery({
        queryKey: ['documents', selectedClient, selectedFolder, searchTerm],
        queryFn: () =>
            documentsService.getDocuments({
                clientId: selectedClient || undefined,
                folderId: selectedFolder || undefined,
                search: searchTerm || undefined,
            }),
        enabled: true,
    });

    // Fetch document stats
    const { data: stats } = useQuery({
        queryKey: ['document-stats', selectedClient],
        queryFn: () =>
            documentsService.getDocumentStats(selectedClient || undefined),
        enabled: true,
    });

    // Fetch folders
    const { data: folders = [] } = useQuery({
        queryKey: ['document-folders', selectedClient],
        queryFn: () => documentsService.getFolders(selectedClient || undefined),
        enabled: true,
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (data: {
            file: File;
            clientId: string;
            documentType: string;
            folderId?: string;
        }) => {
            return documentsService.uploadDocument(data.file, {
                clientId: data.clientId,
                documentType: data.documentType,
                folderId: data.folderId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document-stats'] });
            setUploadDialogOpen(false);
        },
    });

    const getDocumentIcon = (documentType: string) => {
        switch (documentType.toLowerCase()) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-600" />;
            case 'image':
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <FileImage className="w-8 h-8 text-blue-600" />;
            case 'excel':
            case 'xlsx':
            case 'xls':
                return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
            default:
                return <FileText className="w-8 h-8 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            uploaded: {
                label: 'Uploaded',
                className: 'bg-blue-100 text-blue-800',
            },
            processing: {
                label: 'Processing',
                className: 'bg-yellow-100 text-yellow-800',
            },
            completed: {
                label: 'Completed',
                className: 'bg-green-100 text-green-800',
            },
            error: { label: 'Error', className: 'bg-red-100 text-red-800' },
            submitted_to_hmrc: {
                label: 'Submitted to HMRC',
                className: 'bg-purple-100 text-purple-800',
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            className: 'bg-gray-100 text-gray-800',
        };
        return (
            <Badge className={`text-xs ${config.className}`}>
                {config.label}
            </Badge>
        );
    };

    const getProcessingStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'processing':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async (
        file: File,
        data: { clientId: string; documentType: string; folderId?: string },
    ) => {
        await uploadMutation.mutateAsync({
            file,
            clientId: data.clientId,
            documentType: data.documentType,
            folderId: data.folderId,
        });
    };

    const handleDocumentClick = (document: Document) => {
        setSelectedDocument(document);
        setUploadDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Documents
                    </h1>
                    <p className="text-gray-600">
                        Manage and process your business documents
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                        }
                    >
                        {viewMode === 'grid' ? 'List View' : 'Grid View'}
                    </Button>
                    <Dialog
                        open={uploadDialogOpen}
                        onOpenChange={setUploadDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Upload Document</DialogTitle>
                                <DialogDescription>
                                    Upload a document to extract transactions
                                    and submit to HMRC
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Client
                                        </label>
                                        <Select
                                            value={selectedClient}
                                            onValueChange={setSelectedClient}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select client" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="client-1">
                                                    Client 1
                                                </SelectItem>
                                                <SelectItem value="client-2">
                                                    Client 2
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">
                                            Document Type
                                        </label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="receipt">
                                                    Receipt
                                                </SelectItem>
                                                <SelectItem value="invoice">
                                                    Invoice
                                                </SelectItem>
                                                <SelectItem value="bank_statement">
                                                    Bank Statement
                                                </SelectItem>
                                                <SelectItem value="tax_document">
                                                    Tax Document
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Folder
                                    </label>
                                    <Select
                                        value={selectedFolder}
                                        onValueChange={setSelectedFolder}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select folder (optional)" />
                                        </SelectTrigger>
                                        {/* <SelectContent>
                                            {folders.map((folder) => (
                                                <SelectItem
                                                    key={folder.id}
                                                    value={folder.id}
                                                >
                                                    {folder.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent> */}
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        File
                                    </label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Documents
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Transactions
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalTransactions}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Amount
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                £{stats.totalAmount.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Processing
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.byProcessingStatus.processing || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="client-1">Client 1</SelectItem>
                        <SelectItem value="client-2">Client 2</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={selectedFolder}
                    onValueChange={setSelectedFolder}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Folders" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Folders</SelectItem>
                        {/* {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                            </SelectItem>
                        ))} */}
                    </SelectContent>
                </Select>
            </div>

            {/* Documents Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {documents.map((document) => (
                        <Card
                            key={document.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleDocumentClick(document)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    {document.documentType.map((type: string) =>
                                        getDocumentIcon(type),
                                    )}
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    <div>
                                        <p className="font-medium text-sm truncate">
                                            {document.originalFileName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(document.fileSize)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {getStatusBadge(document.status)}
                                        <div className="flex items-center gap-1">
                                            {getProcessingStatusIcon(
                                                document.processingStatus,
                                            )}
                                            {document.aiExtractedTransactions >
                                                0 && (
                                                <Bot className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(
                                            new Date(document.uploadedAt),
                                            'MMM dd, yyyy',
                                        )}
                                    </div>
                                    {document.aiExtractedTransactions > 0 && (
                                        <div className="text-xs text-gray-600">
                                            {document.aiExtractedTransactions}{' '}
                                            transactions extracted
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Transactions</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((document) => (
                                <TableRow
                                    key={document.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {document.documentType.map(
                                                (type: string) =>
                                                    getDocumentIcon(type),
                                            )}
                                            <div>
                                                <p className="font-medium">
                                                    {document.originalFileName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatFileSize(
                                                        document.fileSize,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {document.documentType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(document.status)}
                                            {getProcessingStatusIcon(
                                                document.processingStatus,
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {document.aiExtractedTransactions >
                                                0 && (
                                                <>
                                                    <Bot className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm">
                                                        {
                                                            document.aiExtractedTransactions
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-500">
                                            {format(
                                                new Date(document.uploadedAt),
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDocumentClick(
                                                        document,
                                                    )
                                                }
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Upload Dialog */}
            {selectedDocument && (
                <UploadDialog
                    isOpen={uploadDialogOpen}
                    onClose={() => {
                        setUploadDialogOpen(false);
                        setSelectedDocument(null);
                    }}
                    documentName={selectedDocument.originalFileName}
                    documentType={selectedDocument.documentType as any}
                />
            )}
        </div>
    );
}
