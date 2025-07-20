import { ListOfBusiness } from '@/services/hmrc';
import React from 'react';

type Props = {
    businesses: ListOfBusiness[];
    isLoadingHmrcBusinesses: boolean;
};

export default function HmrcBusinesses({
    businesses,
    isLoadingHmrcBusinesses,
}: Props) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                HMRC Businesses
            </h3>
            {isLoadingHmrcBusinesses ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {businesses.map((business, index) => (
                        <div
                            key={business.businessId}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {business.typeOfBusiness}
                                    </h4>
                                    {business.tradingName && (
                                        <p className="text-sm text-gray-600">
                                            Trading as: {business.tradingName}
                                        </p>
                                    )}
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {business.typeOfBusiness}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Business ID:
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        {business.businessId}
                                    </span>
                                </div>
                                {/* <div>
                                                <span className="font-medium text-gray-700">
                                                    Accounting Type:
                                                </span>
                                                <span className="ml-2 text-gray-600">
                                                    {
                                                        business.accountingType
                                                    }
                                                </span>
                                            </div> */}
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Commencement:
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        {/* {new Date(
                                                        business.commencementDate,
                                                    ).toLocaleDateString()} */}
                                    </span>
                                </div>
                                {/* {business.cessationDate && (
                                                <div>
                                                    <span className="font-medium text-gray-700">
                                                        Cessation:
                                                    </span>
                                                    <span className="ml-2 text-gray-600">
                                                        {new Date(
                                                            business.cessationDate,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )} */}
                            </div>

                            {/* {business.address && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <span className="font-medium text-gray-700">
                                                    Address:
                                                </span>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <div>
                                                        {
                                                            business.address
                                                                .line1
                                                        }
                                                    </div>
                                                    {business.address
                                                        .line2 && (
                                                        <div>
                                                            {
                                                                business
                                                                    .address
                                                                    .line2
                                                            }
                                                        </div>
                                                    )}
                                                    {business.address
                                                        .line3 && (
                                                        <div>
                                                            {
                                                                business
                                                                    .address
                                                                    .line3
                                                            }
                                                        </div>
                                                    )}
                                                    {business.address
                                                        .line4 && (
                                                        <div>
                                                            {
                                                                business
                                                                    .address
                                                                    .line4
                                                            }
                                                        </div>
                                                    )}
                                                    <div>
                                                        {
                                                            business.address
                                                                .postcode
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )} */}

                            {/* {business.accountingPeriod && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <span className="font-medium text-gray-700">
                                                    Accounting Period:
                                                </span>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    {new Date(
                                                        business.accountingPeriod.startDate,
                                                    ).toLocaleDateString()}{' '}
                                                    -{' '}
                                                    {new Date(
                                                        business.accountingPeriod.endDate,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )} */}

                            {/* {business.businessDescription && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <span className="font-medium text-gray-700">
                                                    Description:
                                                </span>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    {
                                                        business.businessDescription
                                                    }
                                                </div>
                                            </div>
                                        )} */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
