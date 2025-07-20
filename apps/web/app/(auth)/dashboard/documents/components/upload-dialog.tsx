'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { hmrcService } from '@/services/hmrc';
import { useQuery } from '@tanstack/react-query';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    documentName?: string;
    documentType?: 'pdf' | 'image' | 'excel' | 'default';
};

type HmrcCategory = {
    code: string;
    name: string;
    description: string;
    type: 'income' | 'expense' | 'both';
};

type TransactionCategory = {
    code: string;
    name: string;
    description: string;
    parentCategory?: string;
    isStandard: boolean;
};

export default function UploadDialog({
    isOpen,
    onClose,
    documentName = 'Document',
    documentType = 'default',
}: Props) {
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(2);
    const [showAddForm, setShowAddForm] = useState(false);
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: 'Apr 15, 2026',
            description: 'Client Payment - Project Alpha',
            category: 'SALES_INCOME',
            amount: 5000.0,
            status: 'verified',
            isAIGenerated: true,
        },
        {
            id: 2,
            date: 'Apr 14, 2026',
            description: 'Office Supplies',
            category: 'OFFICE_EXPENSES',
            amount: -250.0,
            status: 'verified',
            isAIGenerated: false,
        },
        {
            id: 3,
            date: 'Apr 10, 2026',
            description: 'Software Subscription',
            category: 'SOFTWARE_SUBSCRIPTIONS',
            amount: -49.99,
            status: 'verified',
            isAIGenerated: false,
        },
        {
            id: 4,
            date: 'Apr 8, 2026',
            description: 'Client Payment - Project Beta',
            category: 'SALES_INCOME',
            amount: 3200.0,
            status: 'needs_review',
            isAIGenerated: false,
        },
        {
            id: 5,
            date: 'Apr 5, 2026',
            description: 'Travel Expenses',
            category: 'TRAVEL_TRANSPORT',
            amount: -180.5,
            status: 'verified',
            isAIGenerated: false,
        },
        {
            id: 6,
            date: 'Apr 2, 2026',
            description: 'Internet & Phone',
            category: 'UTILITIES',
            amount: -85.0,
            status: 'needs_category',
            isAIGenerated: false,
        },
    ]);

    // Fetch HMRC categories
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['hmrc-categories'],
        queryFn: hmrcService.getHmrcCategories,
        enabled: isOpen,
    });

    const transactionCategories = categoriesData?.transactionCategories || [];
    const businessCategories = categoriesData?.businessCategories || [];

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
            (cat) => cat.code === categoryCode,
        );
        if (!category) {
            return (
                <Badge className="text-xs bg-gray-100 text-gray-800">
                    Unknown
                </Badge>
            );
        }

        const categoryMap: Record<string, { className: string }> = {
            // Income categories
            SALES_INCOME: { className: 'bg-purple-100 text-purple-800' },
            CONSULTING_INCOME: { className: 'bg-purple-100 text-purple-800' },
            PROPERTY_INCOME: { className: 'bg-purple-100 text-purple-800' },
            INTEREST_INCOME: { className: 'bg-purple-100 text-purple-800' },
            OTHER_INCOME: { className: 'bg-purple-100 text-purple-800' },

            // Expense categories
            OFFICE_EXPENSES: { className: 'bg-red-100 text-red-800' },
            SOFTWARE_SUBSCRIPTIONS: { className: 'bg-red-100 text-red-800' },
            TRAVEL_TRANSPORT: { className: 'bg-red-100 text-red-800' },
            UTILITIES: { className: 'bg-red-100 text-red-800' },
            PROFESSIONAL_FEES: { className: 'bg-red-100 text-red-800' },
            MARKETING_ADVERTISING: { className: 'bg-red-100 text-red-800' },
            INSURANCE: { className: 'bg-red-100 text-red-800' },
            MAINTENANCE_REPAIRS: { className: 'bg-red-100 text-red-800' },
            TRAINING_DEVELOPMENT: { className: 'bg-red-100 text-red-800' },
            BANK_CHARGES: { className: 'bg-red-100 text-red-800' },
            DEPRECIATION: { className: 'bg-red-100 text-red-800' },
            RENT: { className: 'bg-red-100 text-red-800' },
            SALARIES_WAGES: { className: 'bg-red-100 text-red-800' },
            PENSION_CONTRIBUTIONS: { className: 'bg-red-100 text-red-800' },
            NATIONAL_INSURANCE: { className: 'bg-red-100 text-red-800' },
        };

        const config = categoryMap[categoryCode] || {
            className: 'bg-gray-100 text-gray-800',
        };
        return (
            <Badge className={`text-xs ${config.className}`}>
                {category.name}
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

    const handleZoomIn = () => setCurrentZoom(Math.min(currentZoom + 0.1, 2));
    const handleZoomOut = () =>
        setCurrentZoom(Math.max(currentZoom - 0.1, 0.5));
    const handlePreviousPage = () =>
        setCurrentPage(Math.max(currentPage - 1, 1));
    const handleNextPage = () =>
        setCurrentPage(Math.min(currentPage + 1, totalPages));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl md:max-w-7xl max-h-[90vh] overflow-hidden p-0 space-y-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-2.5" />
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                Extracted Transactions
                            </DialogTitle>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-5">
                                <span className="font-medium text-gray-900">
                                    {documentName}
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
                            <div
                                className="bg-white w-[90%] h-[95%] shadow-sm relative"
                                style={{ transform: `scale(${currentZoom})` }}
                            >
                                <div className="flex flex-col items-center justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-400 w-full">
                                    {getDocumentIcon()}
                                    <div className="text-sm mt-4">
                                        {documentName} Preview
                                    </div>
                                </div>
                            </div>
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
                                    {transactions.length}
                                </span>{' '}
                                Transactions Extracted
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
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Export
                                </Button>
                                <Button
                                    size="sm"
                                    className="text-xs px-3 py-1.5"
                                >
                                    <Check className="w-3 h-3 mr-1" />
                                    Approve All
                                </Button>
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
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <td className="p-3 text-sm align-middle">
                                                <Input
                                                    type="date"
                                                    className="w-full text-sm"
                                                    defaultValue={
                                                        new Date()
                                                            .toISOString()
                                                            .split('T')[0]
                                                    }
                                                />
                                            </td>
                                            <td className="p-3 text-sm align-middle">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter description"
                                                    className="w-full text-sm"
                                                />
                                            </td>
                                            <td className="p-3 text-sm align-middle">
                                                <Select
                                                    disabled={categoriesLoading}
                                                >
                                                    <SelectTrigger className="w-full text-sm">
                                                        <SelectValue
                                                            placeholder={
                                                                categoriesLoading
                                                                    ? 'Loading categories...'
                                                                    : 'Select category'
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {transactionCategories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.code
                                                                    }
                                                                    value={
                                                                        category.code
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
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
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm align-middle text-center">
                                                <span className="inline-flex items-center text-xs font-medium text-gray-600">
                                                    New Transaction
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm align-middle text-center">
                                                <div className="flex justify-center gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-8 h-8 p-0"
                                                        onClick={() =>
                                                            setShowAddForm(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Transaction Rows */}
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-sm align-middle">
                                                {transaction.date}
                                            </td>
                                            <td className="p-3 text-sm align-middle font-medium">
                                                {transaction.description}
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
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        <Unlink className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
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
