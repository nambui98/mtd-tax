'use client';
import { PracticeType } from '@workspace/database';
import { cn } from '@workspace/ui/lib/utils';
import React, { useState } from 'react';
import { Step, StepFormData } from './content';
import { Button } from '@workspace/ui/components/button';
import { toast } from 'sonner';
import DialogConnectHMRC from './dialog-connect-hmrc';

type Props = {
    onNextStep: (value: Step) => void;
    setStepFormData: React.Dispatch<React.SetStateAction<StepFormData>>;
    practiceType: PracticeType | null;
};

export default function Step1({
    onNextStep,
    setStepFormData,
    practiceType,
}: Props) {
    const handleSetStep1Data = (value: PracticeType) => {
        setStepFormData((prev) => ({
            ...prev,
            step1: {
                practiceType: value,
            },
        }));
    };
    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to TAXAPP
                </h2>
                <p className="text-gray-600">
                    Let's get your accounting practice set up for Making Tax
                    Digital
                </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What type of practice are you?
                    </h3>
                    <div className="space-y-3">
                        <label
                            className={cn(
                                'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors',
                                practiceType === 'accountancy_practice'
                                    ? 'border-primary'
                                    : 'border-gray-200 hover:border-primary',
                            )}
                        >
                            <input
                                type="radio"
                                name="practiceType"
                                value="accountancy_practice"
                                className="sr-only"
                                checked={
                                    practiceType === 'accountancy_practice'
                                }
                                onChange={(e) =>
                                    handleSetStep1Data(
                                        e.target.value as PracticeType,
                                    )
                                }
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                <div
                                    className={cn(
                                        'w-2 h-2 bg-primary rounded-full',
                                        practiceType === 'accountancy_practice'
                                            ? 'block'
                                            : 'hidden',
                                    )}
                                ></div>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Accountancy Practice
                                </div>
                                <div className="text-sm text-gray-500">
                                    Traditional accounting firm with multiple
                                    clients
                                </div>
                            </div>
                        </label>

                        <label
                            className={cn(
                                'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors',
                                practiceType === 'bookkeeping_service'
                                    ? 'border-primary'
                                    : 'border-gray-200 hover:border-primary',
                            )}
                        >
                            <input
                                type="radio"
                                name="practiceType"
                                value="bookkeeping_service"
                                className="sr-only"
                                checked={practiceType === 'bookkeeping_service'}
                                onChange={(e) =>
                                    handleSetStep1Data(
                                        e.target.value as PracticeType,
                                    )
                                }
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                <div
                                    className={cn(
                                        'w-2 h-2 bg-primary rounded-full',
                                        practiceType === 'bookkeeping_service'
                                            ? 'block'
                                            : 'hidden',
                                    )}
                                ></div>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Bookkeeping Service
                                </div>
                                <div className="text-sm text-gray-500">
                                    Bookkeeping and record management service
                                </div>
                            </div>
                        </label>

                        <label
                            className={cn(
                                'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors',
                                practiceType === 'tax_advisory_firm'
                                    ? 'border-primary'
                                    : 'border-gray-200 hover:border-primary',
                            )}
                        >
                            <input
                                type="radio"
                                name="practiceType"
                                value="tax_advisory_firm"
                                className="sr-only"
                                checked={practiceType === 'tax_advisory_firm'}
                                onChange={(e) =>
                                    handleSetStep1Data(
                                        e.target.value as PracticeType,
                                    )
                                }
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                <div
                                    className={cn(
                                        'w-2 h-2 bg-primary rounded-full',
                                        practiceType === 'tax_advisory_firm'
                                            ? 'block'
                                            : 'hidden',
                                    )}
                                ></div>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Tax Advisory Firm
                                </div>
                                <div className="text-sm text-gray-500">
                                    Specialized tax advice and submission
                                    services
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <Button
                    onClick={() => {
                        if (practiceType) {
                            onNextStep('step2');
                        } else {
                            toast.error('Please select a practice type');
                        }
                    }}
                    size={'xl'}
                    className="text-base w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                    Continue
                </Button>
            </div>
        </>
    );
}
