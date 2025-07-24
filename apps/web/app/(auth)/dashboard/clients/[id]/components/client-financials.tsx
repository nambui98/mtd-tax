'use client';

import {
    AlertCircle,
    AlertTriangle,
    Check,
    ChevronRight,
    Clock,
    Edit,
    ExternalLink,
    Receipt,
    Scale,
    TrendingUp,
    Building2,
    MapPin,
    Calendar,
    Phone,
    Mail,
    Globe,
    CreditCard,
    FileText,
    Banknote,
    Briefcase,
    Users,
    DollarSign,
    PieChart,
    Target,
    CalendarDays,
    AlertOctagon,
    CheckCircle,
    XCircle,
    Clock4,
} from 'lucide-react';
import { Coins } from 'lucide-react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { hmrcService } from '@/services/hmrc';
import ClientTransaction from './client-transaction';
import ClientDocuments from './client-documents';

type Props = {
    clientId: string;
    activeBusiness: string;
    nino: string;
    typeOfBusiness: string;
};

export default function ClientFinancials({
    clientId,
    activeBusiness,
    nino,
    typeOfBusiness,
}: Props) {
    const { data: comprehensiveData, isLoading: isLoadingComprehensiveData } =
        useQuery({
            queryKey: [
                'comprehensive-business-info',
                clientId,
                activeBusiness,
                nino,
            ],
            queryFn: () =>
                hmrcService.getComprehensiveBusinessInfo(
                    clientId,
                    activeBusiness,
                    nino,
                    typeOfBusiness,
                ),
            enabled:
                !!clientId &&
                !!activeBusiness &&
                !!nino &&
                activeBusiness !== '',
        });

    const businessDetails = comprehensiveData?.businessDetails;
    const incomeSummary = comprehensiveData?.incomeSummary;
    const bsasData = comprehensiveData?.bsasData;
    const obligations = comprehensiveData?.obligations;
    console.log(comprehensiveData);

    const getBusinessIcon = (businessType?: string) => {
        switch (businessType?.toLowerCase()) {
            case 'self-employed':
            case 'sole trader':
                return <Briefcase className="w-6 h-6 text-blue-600" />;
            case 'property':
            case 'property rental':
                return <Building2 className="w-6 h-6 text-cyan-600" />;
            case 'foreign':
            case 'foreign income':
                return <Globe className="w-6 h-6 text-pink-600" />;
            case 'partnership':
                return <Users className="w-6 h-6 text-purple-600" />;
            case 'limited company':
                return <Banknote className="w-6 h-6 text-green-600" />;
            default:
                return <Briefcase className="w-6 h-6 text-gray-600" />;
        }
    };

    const getBusinessBadgeColor = (businessType?: string) => {
        switch (businessType?.toLowerCase()) {
            case 'self-employed':
            case 'sole trader':
                return 'bg-blue-100 text-blue-800';
            case 'property':
            case 'property rental':
                return 'bg-cyan-100 text-cyan-800';
            case 'foreign':
            case 'foreign income':
                return 'bg-pink-100 text-pink-800';
            case 'partnership':
                return 'bg-purple-100 text-purple-800';
            case 'limited company':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getObligationStatusIcon = (status: string) => {
        switch (status) {
            case 'fulfilled':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'overdue':
                return <AlertOctagon className="w-4 h-4 text-red-500" />;
            case 'open':
                return <Clock4 className="w-4 h-4 text-yellow-500" />;
            default:
                return <Clock4 className="w-4 h-4 text-gray-500" />;
        }
    };

    const getObligationStatusColor = (status: string) => {
        switch (status) {
            case 'fulfilled':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'open':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    if (isLoadingComprehensiveData) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Business Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            {getBusinessIcon(businessDetails?.businessType)}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {businessDetails?.businessName ||
                                        'Business Overview'}
                                </h2>
                                {businessDetails?.tradingName && (
                                    <p className="text-sm text-gray-600">
                                        Trading as:{' '}
                                        {businessDetails.tradingName}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {businessDetails?.businessType && (
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBusinessBadgeColor(businessDetails.businessType)}`}
                                >
                                    {businessDetails.businessType}
                                </span>
                            )}
                            <button className="text-primary hover:text-primary-dark">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Real Financial Metrics */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(
                                    incomeSummary?.totalIncome || 0,
                                )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Coins className="w-3 h-3 mr-1" />
                                Total Income
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(
                                    incomeSummary?.totalExpenses || 0,
                                )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Receipt className="w-3 h-3 mr-1" />
                                Total Expenses
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(incomeSummary?.netProfit || 0)}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Net Profit
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(
                                    (incomeSummary?.netProfit || 0) * 0.2,
                                )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Scale className="w-3 h-3 mr-1" />
                                Estimated Tax
                            </div>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Building2 className="w-5 h-5 mr-2" />
                                Business Details
                            </h3>
                            <button className="text-primary hover:text-primary-dark text-sm">
                                Edit <Edit className="w-3 h-3 inline ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                    Business Type
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {businessDetails?.businessType ||
                                        'Self-Employed'}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                    Start Date
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {businessDetails?.commencementDate
                                        ? formatDate(
                                              businessDetails.commencementDate,
                                          )
                                        : 'Not specified'}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                    Business Description
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {businessDetails?.businessDescription ||
                                        'Not specified'}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                    Accounting Period
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {businessDetails?.accountingPeriod
                                        ? `${formatDate(businessDetails.accountingPeriod.startDate)} - ${formatDate(businessDetails.accountingPeriod.endDate)}`
                                        : 'Not specified'}
                                </div>
                            </div>
                        </div>

                        {/* Additional Business Information */}
                        {businessDetails && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Contact Information */}
                                {(businessDetails.emailAddress ||
                                    businessDetails.websiteAddress ||
                                    businessDetails.contactDetails) && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Contact Information
                                        </h4>
                                        <div className="space-y-2">
                                            {businessDetails.emailAddress && (
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {
                                                            businessDetails.emailAddress
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {businessDetails.websiteAddress && (
                                                <div className="flex items-center space-x-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {
                                                            businessDetails.websiteAddress
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {businessDetails.contactDetails
                                                ?.phoneNumber && (
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {
                                                            businessDetails
                                                                .contactDetails
                                                                .phoneNumber
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Address Information */}
                                {businessDetails.address && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Address
                                        </h4>
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">
                                                {businessDetails.address.line1}
                                            </div>
                                            {businessDetails.address.line2 && (
                                                <div className="text-sm text-gray-900">
                                                    {
                                                        businessDetails.address
                                                            .line2
                                                    }
                                                </div>
                                            )}
                                            {businessDetails.address.line3 && (
                                                <div className="text-sm text-gray-900">
                                                    {
                                                        businessDetails.address
                                                            .line3
                                                    }
                                                </div>
                                            )}
                                            {businessDetails.address.line4 && (
                                                <div className="text-sm text-gray-900">
                                                    {
                                                        businessDetails.address
                                                            .line4
                                                    }
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-900">
                                                {
                                                    businessDetails.address
                                                        .postcode
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bank Details */}
                                {businessDetails.bankDetails && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Bank Details
                                        </h4>
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">
                                                    Account:
                                                </span>{' '}
                                                {
                                                    businessDetails.bankDetails
                                                        .accountName
                                                }
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">
                                                    Sort Code:
                                                </span>{' '}
                                                {
                                                    businessDetails.bankDetails
                                                        .sortCode
                                                }
                                            </div>
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">
                                                    Account Number:
                                                </span>{' '}
                                                {
                                                    businessDetails.bankDetails
                                                        .accountNumber
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Industry Classifications */}
                                {businessDetails.industryClassifications && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Industry Classification
                                        </h4>
                                        <div className="space-y-1">
                                            {businessDetails
                                                .industryClassifications
                                                .sicCode && (
                                                <div className="text-sm text-gray-900">
                                                    <span className="font-medium">
                                                        SIC Code:
                                                    </span>{' '}
                                                    {
                                                        businessDetails
                                                            .industryClassifications
                                                            .sicCode
                                                    }
                                                </div>
                                            )}
                                            {businessDetails
                                                .industryClassifications
                                                .sicDescription && (
                                                <div className="text-sm text-gray-900">
                                                    <span className="font-medium">
                                                        Description:
                                                    </span>{' '}
                                                    {
                                                        businessDetails
                                                            .industryClassifications
                                                            .sicDescription
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* BSAS Information */}
                    {bsasData && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Business Source Adjustable Summary (BSAS)
                            </h3>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="text-lg font-semibold text-blue-900">
                                        {formatCurrency(bsasData.totalIncome)}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        BSAS Income
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                    <div className="text-lg font-semibold text-red-900">
                                        {formatCurrency(bsasData.totalExpenses)}
                                    </div>
                                    <div className="text-xs text-red-600">
                                        BSAS Expenses
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="text-lg font-semibold text-green-900">
                                        {formatCurrency(bsasData.netProfit)}
                                    </div>
                                    <div className="text-xs text-green-600">
                                        BSAS Net Profit
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <div className="text-lg font-semibold text-purple-900">
                                        {bsasData.status}
                                    </div>
                                    <div className="text-xs text-purple-600">
                                        Status
                                    </div>
                                </div>
                            </div>
                            {bsasData.adjustments &&
                                bsasData.adjustments.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Adjustments
                                        </h4>
                                        <div className="space-y-2">
                                            {bsasData.adjustments.map(
                                                (adjustment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    adjustment.type
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                {
                                                                    adjustment.description
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                adjustment.amount,
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}

                    {/* Income Breakdown */}
                    {incomeSummary &&
                        (incomeSummary.incomeBreakdown.length > 0 ||
                            incomeSummary.expenseBreakdown.length > 0) && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <PieChart className="w-5 h-5 mr-2" />
                                    Income & Expense Breakdown
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Income Breakdown */}
                                    {incomeSummary.incomeBreakdown.length >
                                        0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                                Income Categories
                                            </h4>
                                            <div className="space-y-2">
                                                {incomeSummary.incomeBreakdown.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-green-50 rounded-lg p-3"
                                                        >
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {item.category}
                                                            </span>
                                                            <span className="text-sm font-semibold text-green-600">
                                                                {formatCurrency(
                                                                    item.amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expense Breakdown */}
                                    {incomeSummary.expenseBreakdown.length >
                                        0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                                Expense Categories
                                            </h4>
                                            <div className="space-y-2">
                                                {incomeSummary.expenseBreakdown.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-red-50 rounded-lg p-3"
                                                        >
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {item.category}
                                                            </span>
                                                            <span className="text-sm font-semibold text-red-600">
                                                                {formatCurrency(
                                                                    item.amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Business Obligations */}
                    {obligations && obligations.obligations.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CalendarDays className="w-5 h-5 mr-2" />
                                Business Obligations
                            </h3>
                            <div className="space-y-3">
                                {obligations.obligations.map(
                                    (obligation, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {getObligationStatusIcon(
                                                        obligation.status,
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {
                                                            obligation.obligationType
                                                        }
                                                    </span>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getObligationStatusColor(obligation.status)}`}
                                                >
                                                    {obligation.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                                <div>
                                                    <span className="font-medium">
                                                        Due Date:
                                                    </span>{' '}
                                                    {formatDate(
                                                        obligation.dueDate,
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Period:
                                                    </span>{' '}
                                                    {formatDate(
                                                        obligation.startDate,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatDate(
                                                        obligation.endDate,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <ClientTransaction
                businessId={activeBusiness}
                clientId={clientId}
            />

            {/* Grid Layout for Additional Content */}
            <div className="grid grid-cols-3 gap-6">
                {/* Quarterly Submissions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Quarterly Submissions
                            </h2>
                            <button className="text-primary hover:text-primary-dark text-sm">
                                View All{' '}
                                <ChevronRight className="w-3 h-3 inline ml-1" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                                    <div className="text-xs text-gray-500">
                                        5 Apr 2026
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        End of Tax Year
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Tax year 2025-2026 completed
                                    </div>
                                </div>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Clock className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                    <div className="text-xs text-gray-500">
                                        7 Aug 2026
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Q1 Submission Due
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Quarter 1 (Apr-Jun) update for
                                        {businessDetails?.businessName ||
                                            'Consulting Business'}
                                    </div>
                                </div>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                                    <div className="text-xs text-gray-500">
                                        7 Nov 2026
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Q2 Submission Due
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Quarter 2 (Jul-Sep) update for
                                        {businessDetails?.businessName ||
                                            'Consulting Business'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <ClientDocuments
                    clientId={clientId}
                    businessId={activeBusiness}
                    typeOfBusiness={businessDetails?.businessType || undefined}
                />
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {businessDetails?.businessName ||
                                'Consulting Business'}{' '}
                            Financial Summary
                        </h2>
                        <button className="text-primary hover:text-primary-dark text-sm">
                            Detailed View{' '}
                            <ChevronRight className="w-3 h-3 inline ml-1" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-xl font-semibold text-gray-900">
                                {formatCurrency(
                                    incomeSummary?.totalIncome || 0,
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Income
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-xl font-semibold text-gray-900">
                                {formatCurrency(
                                    incomeSummary?.totalExpenses || 0,
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Expenses
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-xl font-semibold text-gray-900">
                                {formatCurrency(incomeSummary?.netProfit || 0)}
                            </div>
                            <div className="text-xs text-gray-500">
                                Net Profit
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-xl font-semibold text-gray-900">
                                {formatCurrency(
                                    (incomeSummary?.netProfit || 0) * 0.2,
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Estimated Tax
                            </div>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                    Current Year
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                    Previous Year
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    Sales / Services
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                                    {formatCurrency(
                                        incomeSummary?.totalIncome || 0,
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                                    £105,000
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    Office Expenses
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £15,200
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £12,500
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    Travel & Transport
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £8,500
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £7,200
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    Software Subscriptions
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £3,000
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                    £2,800
                                </td>
                            </tr>
                            <tr className="border-t-2 border-gray-200">
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                    Net Profit
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                                    {formatCurrency(
                                        incomeSummary?.netProfit || 0,
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                                    £82,500
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        {businessDetails?.businessName || 'Consulting Business'}{' '}
                        Revenue & Expense Chart (Q1-Q4)
                    </div>
                </div>
            </div>
        </div>
    );
}
