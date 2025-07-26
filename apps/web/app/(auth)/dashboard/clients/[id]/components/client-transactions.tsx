'use client';
import {
    clientsService,
    TransactionCategory,
    TransactionFilters,
    TransactionStatistics,
} from '@/services/clients';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronRight,
    User,
    Mail,
    Edit,
    Plus,
    Filter,
    Eye,
    Trash,
    FileText,
    FileImage,
    Calendar,
    Briefcase,
    Home,
    Globe,
    ArrowUp,
    ArrowDown,
    TrendingUp,
    History,
    Info,
    ClipboardList,
    Bell,
    Download,
    MoreVertical,
    ArrowRightLeft,
    Sheet,
    Search,
    X,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Loader2Icon,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@workspace/ui/components/button';
import { MAPPING_HMRC_TO_TRANSACTION_CATEGORIES } from '@/constants/transaction';
import {
    Select,
    SelectItem,
    SelectContent,
    SelectValue,
    SelectTrigger,
} from '@workspace/ui/components/select';
import { TypeOfBusiness } from '@/types/document';
import { Input } from '@workspace/ui/components/input';
import UploadDialog from '../../../documents/components/upload-dialog';
import { documentsService } from '@/services/documents';
import { toast } from 'sonner';
import { Check, RotateCcw } from 'lucide-react';
import ConfirmDeletePopover from '@/components/confirm-delete-popover';
import DateRangePicker from '@/components/date-range-picker';
import { cn } from '@workspace/ui/lib/utils';

type Props = {
    businessId: string;
    clientId: string;
    typeOfBusiness?: TypeOfBusiness;
};

type FilterState = {
    search: string;
    businessId: string;
    category: string;
    status: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
};

type EditTransactionFormProps = {
    transaction: any;
    transactionCategories: any[];
    onSave: () => void;
    onCancel: () => void;
    data: any;
    onDataChange: (data: any) => void;
    isPending: boolean;
};

const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'reconciled':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'unreconciled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return <FileText className="w-4 h-4" />;
        case 'xlsx':
        case 'xls':
            return <Sheet className="w-4 h-4" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <FileImage className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

function EditTransactionForm({
    transaction,
    transactionCategories,
    onSave,
    onCancel,
    data,
    onDataChange,
    isPending,
}: EditTransactionFormProps) {
    return (
        <tr className="bg-blue-50 border-b border-gray-200">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <Input
                    type="date"
                    value={data.transactionDate}
                    onChange={(e) =>
                        onDataChange({
                            ...data,
                            transactionDate: e.target.value,
                        })
                    }
                    className="w-full text-sm"
                />
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Input
                    type="text"
                    value={data.description}
                    onChange={(e) =>
                        onDataChange({ ...data, description: e.target.value })
                    }
                    className="w-full text-sm"
                    placeholder="Enter description"
                />
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <Select
                    value={data.category}
                    onValueChange={(value) =>
                        onDataChange({ ...data, category: value })
                    }
                >
                    <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionCategories.map((category: any) => (
                            <SelectItem
                                key={category.value}
                                value={category.value}
                            >
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.businessId || 'N/A'}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        £
                    </span>
                    <Input
                        type="number"
                        value={data.amount}
                        onChange={(e) =>
                            onDataChange({ ...data, amount: e.target.value })
                        }
                        className="w-full text-sm pl-6"
                        placeholder="0.00"
                        step="0.01"
                    />
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}
                >
                    {transaction.status === 'reconciled'
                        ? 'Reconciled'
                        : transaction.status === 'pending'
                          ? 'Pending'
                          : 'Unreconciled'}
                </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.documentId ? (
                    <a
                        href="#"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        {getDocumentIcon('document.pdf')}
                        <span className="ml-1">View Document</span>
                    </a>
                ) : (
                    <span className="text-gray-400">No document</span>
                )}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onSave}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function ClientTransactions({
    businessId,
    clientId,
    typeOfBusiness,
}: Props) {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        businessId: '',
        category: '',
        status: '',
        type: '',
        dateFrom: '',
        dateTo: '',
        amountMin: '',
        amountMax: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [sortBy, setSortBy] = useState('transactionDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [editingTransactionId, setEditingTransactionId] = useState<
        string | null
    >(null);
    const [editingTransactionData, setEditingTransactionData] =
        useState<any>(null);
    const transactionCategories = useMemo(
        () =>
            typeOfBusiness
                ? MAPPING_HMRC_TO_TRANSACTION_CATEGORIES[
                      typeOfBusiness as keyof typeof MAPPING_HMRC_TO_TRANSACTION_CATEGORIES
                  ]
                : [],
        [typeOfBusiness],
    );
    // Convert filters to API format
    const apiFilters: TransactionFilters = useMemo(
        () => ({
            ...filters,
            category: filters.category === 'all' ? '' : filters.category,
            type: filters.type === 'all' ? '' : filters.type,
            status: filters.status === 'all' ? '' : filters.status,
            page: currentPage,
            limit: 10,
            sortBy,
            sortOrder,
            amountMin: filters.amountMin
                ? parseFloat(filters.amountMin)
                : undefined,
            amountMax: filters.amountMax
                ? parseFloat(filters.amountMax)
                : undefined,
        }),
        [filters, currentPage, sortBy, sortOrder],
    );

    // Statistics filters
    const statisticsFilters = useMemo(
        () => ({
            businessId: filters.businessId || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            category: filters.category || undefined,
            status: filters.status || undefined,
        }),
        [filters],
    );

    // Queries
    const { data: statistics, isLoading: isLoadingStats } = useQuery({
        queryKey: ['transaction-statistics', clientId, statisticsFilters],
        queryFn: () =>
            clientsService.getTransactionStatistics(
                clientId,
                statisticsFilters,
            ),
        enabled: !!clientId,
    });

    const { data: transactionsData, isLoading: isLoadingTransactions } =
        useQuery({
            queryKey: ['filtered-transactions', clientId, apiFilters],
            queryFn: () =>
                clientsService.getFilteredTransactions(clientId, apiFilters),
            enabled: !!clientId,
        });

    // Mutations
    const refreshQueries = useMutation({
        mutationFn: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['transaction-statistics', clientId],
            });
            await queryClient.invalidateQueries({
                queryKey: ['filtered-transactions', clientId],
            });
        },
    });

    // View document mutation
    const viewDocumentMutation = useMutation({
        mutationFn: async (documentId: string) => {
            const result =
                await documentsService.getDocumentDownloadUrl(documentId);
            return result.downloadUrl;
        },
        onSuccess: (documentUrl) => {
            const a = document.createElement('a');
            a.href = documentUrl;
            a.target = '_blank';
            a.click();
        },
        onError: (error: any) => {
            toast.error(`Failed to open document: ${error.message}`);
        },
    });

    // Update transaction mutation
    const updateTransactionMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return documentsService.updateTransaction(id, data);
        },
        onSuccess: () => {
            toast.success('Transaction updated successfully');
            setEditingTransactionId(null);
            setEditingTransactionData(null);
            refreshQueries.mutate();
        },
        onError: (error: any) => {
            toast.error(`Failed to update transaction: ${error.message}`);
        },
    });

    // Delete transaction mutation
    const deleteTransactionMutation = useMutation({
        mutationFn: async (transactionId: string) => {
            return documentsService.deleteTransaction(transactionId);
        },
        onSuccess: () => {
            toast.success('Transaction deleted successfully');
            refreshQueries.mutate();
        },
        onError: (error: any) => {
            toast.error(`Failed to delete transaction: ${error.message}`);
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
            businessId: '',
            category: '',
            status: '',
            type: '',
            dateFrom: '',
            dateTo: '',
            amountMin: '',
            amountMax: '',
        });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            businessId: '',
            category: '',
            status: '',
            type: '',
            dateFrom: '',
            dateTo: '',
            amountMin: '',
            amountMax: '',
        });
        setCurrentPage(1);
        setSortBy('transactionDate');
        setSortOrder('desc');
        refreshQueries.mutate();
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleEditTransaction = (transaction: any) => {
        setEditingTransactionId(transaction.id);
        setEditingTransactionData({
            transactionDate: transaction.transactionDate,
            description: transaction.description,
            category: transaction.category,
            amount: transaction.amount.toString(),
        });
    };

    const handleSaveTransaction = () => {
        if (!editingTransactionId || !editingTransactionData) return;

        const data = {
            transactionDate: editingTransactionData.transactionDate,
            description: editingTransactionData.description,
            category: editingTransactionData.category,
            amount: parseFloat(editingTransactionData.amount),
        };

        updateTransactionMutation.mutate({ id: editingTransactionId, data });
    };

    const handleCancelEdit = () => {
        setEditingTransactionId(null);
        setEditingTransactionData(null);
    };

    const handleViewDocument = (documentId: string) => {
        viewDocumentMutation.mutate(documentId);
    };

    const handleDeleteTransaction = (transactionId: string) => {
        deleteTransactionMutation.mutate(transactionId);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Transaction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : formatCurrency(
                                  statistics?.summary.totalIncome || 0,
                              )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <ArrowUp className="w-4 h-4 mr-1 text-green-600" />
                        Total Income
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : formatCurrency(
                                  statistics?.summary.totalExpenses || 0,
                              )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <ArrowDown className="w-4 h-4 mr-1 text-red-600" />
                        Total Expenses
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : formatCurrency(
                                  statistics?.summary.netProfit || 0,
                              )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
                        Net Profit
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                        {isLoadingStats
                            ? '...'
                            : statistics?.summary.totalTransactions || 0}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <ArrowRightLeft className="w-4 h-4 mr-1 text-gray-600" />
                        Total Transactions
                    </div>
                </div>
            </div>

            {/* Transactions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Transaction History
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant={'outline'}
                                onClick={() =>
                                    setShowAdvancedFilters(!showAdvancedFilters)
                                }
                            >
                                <Filter
                                    className={cn(
                                        'w-4 h-4',
                                        showAdvancedFilters && 'fill-black',
                                    )}
                                />
                                {showAdvancedFilters ? 'Hide' : 'Advanced'}{' '}
                                Filters
                            </Button>
                            <Button onClick={() => refreshQueries.mutate()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                            <Button
                                onClick={handleResetFilters}
                                variant={'outline'}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex gap-3 flex-wrap">
                        {/* Search */}
                        <div className="flex-1 min-w-48 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                                className="pl-10 pr-3 py-2 h-[42px]"
                                placeholder="Search transactions..."
                            />
                        </div>
                        {/* Category Filter */}
                        <div>
                            <Select
                                value={filters.category}
                                onValueChange={(value) =>
                                    handleFilterChange('category', value)
                                }
                            >
                                <SelectTrigger className="w-full text-sm py-5">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {transactionCategories.map(
                                        (category: any) => (
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
                        </div>
                        {/* Type Filter */}
                        <div>
                            <Select
                                value={filters.type}
                                onValueChange={(value) =>
                                    handleFilterChange('type', value)
                                }
                            >
                                <SelectTrigger className="w-full text-sm py-5">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    <SelectItem key={'income'} value={'income'}>
                                        Income
                                    </SelectItem>
                                    <SelectItem
                                        key={'expense'}
                                        value={'expense'}
                                    >
                                        Expense
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    handleFilterChange('status', value)
                                }
                            >
                                <SelectTrigger className="w-full text-sm py-[19px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem
                                        key={'reconciled'}
                                        value={'reconciled'}
                                    >
                                        Reconciled
                                    </SelectItem>
                                    <SelectItem
                                        key={'pending'}
                                        value={'pending'}
                                    >
                                        Pending
                                    </SelectItem>
                                    <SelectItem
                                        key={'unreconciled'}
                                        value={'unreconciled'}
                                    >
                                        Unreconciled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Clear Filters */}
                        {/* {(filters.search ||
                            filters.businessId ||
                            filters.category ||
                            filters.type ||
                            filters.status) && (
                            <Button
                                variant={'outline'}
                                onClick={handleClearFilters}
                                size={'lg'}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        )} */}
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date From
                                    </label>
                                    <DateRangePicker
                                        dateRange={
                                            filters.dateFrom || filters.dateTo
                                                ? {
                                                      from: filters.dateFrom
                                                          ? new Date(
                                                                filters.dateFrom,
                                                            )
                                                          : undefined,
                                                      to: filters.dateTo
                                                          ? new Date(
                                                                filters.dateTo,
                                                            )
                                                          : undefined,
                                                  }
                                                : undefined
                                        }
                                        setDateRange={(dateRange) => {
                                            handleFilterChange(
                                                'dateFrom',
                                                dateRange?.from?.toISOString() ||
                                                    '',
                                            );
                                            handleFilterChange(
                                                'dateTo',
                                                dateRange?.to?.toISOString() ||
                                                    '',
                                            );
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={filters.amountMin}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'amountMin',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={filters.amountMax}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'amountMax',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button
                                        onClick={() =>
                                            handleSort('transactionDate')
                                        }
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Date
                                        {sortBy === 'transactionDate' &&
                                            (sortOrder === 'asc' ? (
                                                <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            ))}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button
                                        onClick={() =>
                                            handleSort('description')
                                        }
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Description
                                        {sortBy === 'description' &&
                                            (sortOrder === 'asc' ? (
                                                <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            ))}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('category')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Category
                                        {sortBy === 'category' &&
                                            (sortOrder === 'asc' ? (
                                                <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            ))}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('amount')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Amount
                                        {sortBy === 'amount' &&
                                            (sortOrder === 'asc' ? (
                                                <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            ))}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button
                                        onClick={() => handleSort('status')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Status
                                        {sortBy === 'status' &&
                                            (sortOrder === 'asc' ? (
                                                <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            ))}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoadingTransactions ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactionsData?.transactions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactionsData?.transactions.map(
                                    (transaction) => (
                                        <React.Fragment key={transaction.id}>
                                            {editingTransactionId ===
                                            transaction.id ? (
                                                <EditTransactionForm
                                                    transaction={transaction}
                                                    transactionCategories={
                                                        transactionCategories
                                                    }
                                                    onSave={
                                                        handleSaveTransaction
                                                    }
                                                    onCancel={handleCancelEdit}
                                                    data={
                                                        editingTransactionData
                                                    }
                                                    onDataChange={
                                                        setEditingTransactionData
                                                    }
                                                    isPending={
                                                        updateTransactionMutation.isPending
                                                    }
                                                />
                                            ) : (
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {format(
                                                            new Date(
                                                                transaction.transactionDate,
                                                            ),
                                                            'dd MMM yyyy',
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {
                                                            transaction.description
                                                        }
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transactionCategories.find(
                                                            (category) =>
                                                                category.value ===
                                                                transaction.category,
                                                        )?.label ||
                                                            transaction.category}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaction.businessId ||
                                                            'N/A'}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                        {formatCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            transaction.status,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaction.documentId ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleViewDocument(
                                                                        transaction.documentId,
                                                                    )
                                                                }
                                                                disabled={
                                                                    viewDocumentMutation.isPending &&
                                                                    viewDocumentMutation.variables ===
                                                                        transaction.documentId
                                                                }
                                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 p-0 h-auto"
                                                            >
                                                                {viewDocumentMutation.isPending &&
                                                                viewDocumentMutation.variables ===
                                                                    transaction.documentId ? (
                                                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    getDocumentIcon(
                                                                        'document.pdf',
                                                                    )
                                                                )}
                                                                <span className="ml-1">
                                                                    View
                                                                    Document
                                                                </span>
                                                            </Button>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                No document
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={
                                                                    'outline'
                                                                }
                                                                size={'icon'}
                                                                onClick={() =>
                                                                    handleEditTransaction(
                                                                        transaction,
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>

                                                            <ConfirmDeletePopover
                                                                title="Delete Transaction"
                                                                description="Are you sure you want to delete this transaction? This action cannot be undone."
                                                                onConfirm={() =>
                                                                    handleDeleteTransaction(
                                                                        transaction.id,
                                                                    )
                                                                }
                                                                isLoading={
                                                                    deleteTransactionMutation.isPending &&
                                                                    deleteTransactionMutation.variables ===
                                                                        transaction.id
                                                                }
                                                                isSuccess={
                                                                    deleteTransactionMutation.isSuccess
                                                                }
                                                            >
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    disabled={
                                                                        deleteTransactionMutation.isPending
                                                                    }
                                                                >
                                                                    {deleteTransactionMutation.isPending &&
                                                                    deleteTransactionMutation.variables ===
                                                                        transaction.id ? (
                                                                        <Loader2Icon className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </ConfirmDeletePopover>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ),
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactionsData?.pagination && (
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Showing{' '}
                                {(transactionsData.pagination.page - 1) *
                                    transactionsData.pagination.limit +
                                    1}{' '}
                                to{' '}
                                {Math.min(
                                    transactionsData.pagination.page *
                                        transactionsData.pagination.limit,
                                    transactionsData.pagination.total,
                                )}{' '}
                                of {transactionsData.pagination.total}{' '}
                                transactions
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={'outline'}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant={'outline'}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        currentPage >=
                                        (transactionsData.pagination
                                            .totalPages || 1)
                                    }
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

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
