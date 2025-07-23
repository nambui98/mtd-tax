'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import UploadDialog from '@/app/(auth)/dashboard/documents/components/upload-dialog';

type Props = {
    clientId: string;
};

export default function ClientDocuments({ clientId }: Props) {
    const [isLoadingDocuments] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showAddTransactionModal, setShowAddTransactionModal] =
        useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);

    const documents = [
        {
            id: 1,
            name: 'April 2026 Bank Statement (Consulting)',
            type: 'pdf',
            date: 'May 15, 2026',
            business: 'Consulting',
            uploadedBy: 'Client Upload',
            pages: 2,
            status: 'processed',
            tags: ['Bank Statement', 'Income'],
        },
        {
            id: 2,
            name: 'Property Income Q1 2026',
            type: 'excel',
            date: 'May 10, 2026',
            business: 'Property Rental',
            uploadedBy: 'Client Upload',
            status: 'processed',
            tags: ['Income Report'],
        },
        {
            id: 3,
            name: 'Foreign Property Expenses',
            type: 'image',
            date: 'May 5, 2026',
            business: 'Foreign Income',
            uploadedBy: 'Client Upload',
            status: 'pending',
            tags: ['Receipt', 'Expense'],
        },
        {
            id: 4,
            name: '2025-2026 Year End Report',
            type: 'default',
            date: 'April 15, 2026',
            business: 'All Businesses',
            uploadedBy: 'Sarah Johnson',
            status: 'processed',
            tags: ['Tax Document'],
        },
        {
            id: 5,
            name: 'Software Subscription Invoice',
            type: 'pdf',
            date: 'April 10, 2026',
            business: 'Consulting',
            uploadedBy: 'Client Upload',
            status: 'error',
            tags: ['Invoice', 'Expense'],
        },
        {
            id: 6,
            name: 'Property Maintenance Receipt',
            type: 'image',
            date: 'April 3, 2026',
            business: 'Property Rental',
            uploadedBy: 'Client Upload',
            status: 'processed',
            tags: ['Receipt', 'Expense'],
        },
    ];

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
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'processed':
                return 'Processed';
            case 'pending':
                return 'Processing';
            case 'error':
                return 'Needs Review';
            default:
                return 'Unknown';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'processed':
                return 'text-green-700';
            case 'pending':
                return 'text-yellow-700';
            case 'error':
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
                                <span className="font-semibold">3</span>{' '}
                                documents processed today
                            </div>
                            <div>
                                <span className="font-semibold">8</span>{' '}
                                transactions extracted
                            </div>
                            <div>
                                <span className="font-semibold">95%</span>{' '}
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
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All Document Types</option>
                        <option>Receipts</option>
                        <option>Invoices</option>
                        <option>Bank Statements</option>
                        <option>Tax Documents</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All Businesses</option>
                        <option>Consulting (Self-Employed)</option>
                        <option>Property Rental</option>
                        <option>Foreign Income</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All Statuses</option>
                        <option>Processed</option>
                        <option>Pending</option>
                        <option>Error</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <UploadDialog>
                        <Button size="sm">
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

            {/* May Documents */}
            <div className="text-sm font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-4">
                May 2026
            </div>
            <div className="space-y-0">
                {documents.slice(0, 3).map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowPreviewModal(true)}
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                            {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                                {doc.name}
                            </div>
                            <div className="flex text-xs text-gray-600 gap-4 flex-wrap">
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {doc.date}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {doc.business}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {doc.uploadedBy}
                                </div>
                                {doc.pages && (
                                    <div className="flex items-center">
                                        <FileText className="w-3 h-3 mr-1" />
                                        {doc.pages} pages
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                {doc.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center mr-4">
                            <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)} mr-2`}
                            ></div>
                            <span
                                className={`text-xs font-medium ${getStatusTextColor(doc.status)}`}
                            >
                                {getStatusText(doc.status)}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* April Documents */}
            <div className="text-sm font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-4 mt-6">
                April 2026
            </div>
            <div className="space-y-0">
                {documents.slice(3).map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowPreviewModal(true)}
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                            {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                                {doc.name}
                            </div>
                            <div className="flex text-xs text-gray-600 gap-4 flex-wrap">
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {doc.date}
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {doc.business}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {doc.uploadedBy}
                                </div>
                                {doc.pages && (
                                    <div className="flex items-center">
                                        <FileText className="w-3 h-3 mr-1" />
                                        {doc.pages} pages
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                {doc.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center mr-4">
                            <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)} mr-2`}
                            ></div>
                            <span
                                className={`text-xs font-medium ${getStatusTextColor(doc.status)}`}
                            >
                                {getStatusText(doc.status)}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing 6 of 78 documents
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
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                <File className="w-6 h-6 mr-2" />
                                Extracted Transactions
                            </h3>
                            <div className="flex items-center">
                                <div className="mr-5 text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">
                                        April 2026 Bank Statement (Consulting)
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex h-[600px]">
                            {/* Document Preview Panel */}
                            <div className="w-2/5 border-r border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        Document Preview
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-600 hover:text-gray-800">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:text-gray-800">
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:text-gray-800">
                                            <Expand className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 bg-gray-100 flex items-center justify-center">
                                    <div className="bg-white w-4/5 h-4/5 shadow-sm relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <File className="w-16 h-16 mb-4 mx-auto" />
                                                <div className="text-sm">
                                                    Document Preview
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <div className="text-xs text-gray-600">
                                        Page 1 of 2
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </button>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions Panel */}
                            <div className="w-3/5">
                                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        <span className="text-blue-600 font-semibold">
                                            6
                                        </span>{' '}
                                        Transactions Extracted
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowAddTransactionForm(
                                                    !showAddTransactionForm,
                                                )
                                            }
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Transaction
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <FileDown className="w-4 h-4 mr-1" />
                                            Export
                                        </Button>
                                        <Button size="sm">
                                            <Check className="w-4 h-4 mr-1" />
                                            Approve All
                                        </Button>
                                    </div>
                                </div>

                                <div className="h-[552px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 sticky top-0">
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
                                            {/* Sample transactions */}
                                            <tr className="border-b border-gray-200 bg-blue-50">
                                                <td className="p-3 text-sm">
                                                    Apr 15, 2026
                                                </td>
                                                <td className="p-3 text-sm font-medium">
                                                    Client Payment - Project
                                                    Alpha
                                                </td>
                                                <td className="p-3 text-sm">
                                                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 mr-2">
                                                        Income
                                                    </span>
                                                    <span className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        <Bot className="w-3 h-3 mr-1" />
                                                        AI Generated
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-right font-medium text-green-600">
                                                    £5,000.00
                                                </td>
                                                <td className="p-3 text-sm text-center">
                                                    <span className="inline-flex items-center text-xs font-medium text-green-700">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                        Verified
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-center">
                                                    <div className="flex justify-center gap-1">
                                                        <button className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200">
                                                            <Edit className="w-3 h-3" />
                                                        </button>
                                                        <button className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200">
                                                            <Unlink className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Add more sample transactions here */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
