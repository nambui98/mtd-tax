'use client';
import { clientsService } from '@/services/clients';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import React from 'react';

type Props = {
    businessId: string;
    clientId: string;
};

export default function ClientTransaction({ businessId, clientId }: Props) {
    const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['transactions', clientId],
        queryFn: () => clientsService.getClientTransactions(clientId as string),
        enabled: !!clientId,
    });
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Transactions
                    </h2>
                    <button className="text-primary hover:text-primary-dark text-sm">
                        View All{' '}
                        <ChevronRight className="w-3 h-3 inline ml-1" />
                    </button>
                </div>
            </div>
            <div className="p-6">
                {isLoadingTransactions ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* {transactions
                    ?.slice(0, 4)
                    .map((transaction, index) => (
                        <div
                            key={index}
                            className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
                        >
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 ${
                                    transaction.type ===
                                    'income'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                }`}
                            >
                                {transaction.type ===
                                'income' ? (
                                    <ArrowDown className="w-4 h-4" />
                                ) : (
                                    <ArrowUp className="w-4 h-4" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                    {
                                        transaction.description
                                    }
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {transaction.date}
                                    <Tag className="w-3 h-3 ml-3 mr-1" />
                                    {transaction.category}
                                </div>
                            </div>
                            <div
                                className={`text-sm font-semibold ${
                                    transaction.type ===
                                    'income'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {transaction.type ===
                                'income'
                                    ? '+'
                                    : '-'}
                                £
                                {transaction.amount.toLocaleString()}
                            </div>
                        </div>
                    ))} */}
                    </div>
                )}
            </div>
        </div>
    );
}
