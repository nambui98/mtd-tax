import React from 'react';

type Props = {};

export default function DocumentsContent({}: Props) {
    return (
        <>
            <div className="flex items-center p-4 bg-blue-50 border-l-4 border-blue-500 mb-6">
                <div className="flex-shrink-0">
                    <i className="fas fa-robot text-blue-500 text-2xl"></i>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-blue-700">
                        AI Document Processing Active
                    </p>
                    <p className="text-sm text-blue-600">
                        We're currently processing 5 recently uploaded
                        documents. OCR extraction and categorization will
                        complete shortly.
                    </p>
                </div>
                <button className="ml-auto bg-transparent text-blue-500 hover:text-blue-700">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer transition-all duration-200 bg-white hover:border-blue-500 hover:bg-gray-50 mb-6">
                <div className="text-3xl text-gray-500 mb-4">
                    <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop documents here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                    Upload receipts, invoices, bank statements, and other
                    financial documents. Our AI will automatically extract
                    transaction data and suggest categorizations.
                </p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                            placeholder="Search documents..."
                        />
                    </div>
                    <select className="py-2 px-4 border border-gray-300 rounded-lg text-sm bg-white">
                        <option>All Document Types</option>
                        <option>Receipts</option>
                        <option>Invoices</option>
                        <option>Bank Statements</option>
                        <option>Tax Documents</option>
                    </select>
                    <select className="py-2 px-4 border border-gray-300 rounded-lg text-sm bg-white">
                        <option>All Clients</option>
                        <option>John Smith</option>
                        <option>Green Properties</option>
                        <option>Taylor Freelance</option>
                        <option>Apex Solutions</option>
                    </select>
                    <select className="py-2 px-4 border border-gray-300 rounded-lg text-sm bg-white">
                        <option>All Statuses</option>
                        <option>Processed</option>
                        <option>Pending</option>
                        <option>Error</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 py-2 px-4 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
                        <i className="fas fa-filter"></i> Filters
                    </button>
                    <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i className="fas fa-plus"></i> Upload Document
                    </button>
                </div>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-2 py-2 px-4 bg-white text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                    <i className="fas fa-folder"></i> Folders
                </div>
                <div className="flex items-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 border border-blue-300 rounded-lg cursor-pointer">
                    <i className="fas fa-th"></i> Grid View
                </div>
                <div className="flex items-center gap-2 py-2 px-4 bg-white text-gray-600 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                    <i className="fas fa-list"></i> List View
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
                        <i className="fas fa-file-invoice-dollar text-4xl text-gray-400"></i>
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                            Invoice
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            Invoice 2026-001
                        </h3>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                            <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                <span>2026-03-15</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-file-pdf mr-1"></i>
                                <span>PDF</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-file-pdf"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
                        <i className="fas fa-file-receipt text-4xl text-gray-400"></i>
                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                            Receipt
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            Receipt 2026-002
                        </h3>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                            <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                <span>2026-03-18</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-file-receipt mr-1"></i>
                                <span>Receipt</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-file-receipt"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
                        <i className="fas fa-file-invoice-dollar text-4xl text-gray-400"></i>
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                            Invoice
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            Invoice 2026-003
                        </h3>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                            <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                <span>2026-03-20</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-file-pdf mr-1"></i>
                                <span>PDF</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-file-pdf"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative">
                        <i className="fas fa-file-receipt text-4xl text-gray-400"></i>
                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                            Receipt
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            Receipt 2026-004
                        </h3>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                            <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                <span>2026-03-22</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-file-receipt mr-1"></i>
                                <span>Receipt</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-eye"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                                <i className="fas fa-file-receipt"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
