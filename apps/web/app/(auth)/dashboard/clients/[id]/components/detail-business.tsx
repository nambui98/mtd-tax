import React from 'react';

type Props = {};

export default function DetailBusiness({}: Props) {
    return (
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
    );
}
