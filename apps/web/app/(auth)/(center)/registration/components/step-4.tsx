'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { DynamicFormField } from '@workspace/ui/components/dynamic-form-field';
import { Form } from '@workspace/ui/components/form';
import { Button } from '@workspace/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { Step, StepFormData } from './content';
import {
    InsertHMRC,
    insertHMRCSchema,
    InsertUser,
    insertUserSchema,
} from '@workspace/database/dist/schema/users';
import { Link2Icon, LinkIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    onPrevious: VoidFunction;
    setStep: (value: Step) => void;
    setStepFormData: React.Dispatch<React.SetStateAction<StepFormData>>;
    user: InsertHMRC | null;
};

export default function Step4({
    onPrevious,
    user,
    setStepFormData,
    setStep,
}: Props) {
    const form = useForm<InsertHMRC>({
        resolver: zodResolver(insertHMRCSchema),
        defaultValues: { ...user },
    });
    function onSubmit(values: InsertHMRC) {
        setStepFormData((prev) => ({
            ...prev,
            step4: values,
        }));
    }
    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    HMRC Integration
                </h2>
                <p className="text-gray-600">
                    Connect your agency to HMRC for MTD submissions
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LinkIcon />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Not Connected to HMRC
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Connect your agency to HMRC to enable MTD submissions on
                        behalf of your clients
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <div className="flex items-start">
                            <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">You'll need:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>Agent Reference Number (ARN)</li>
                                    <li>HMRC Government Gateway credentials</li>
                                    <li>Authority to act for clients</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="gap-6 grid grid-cols-2"
                    >
                        <div className="col-span-2">
                            <DynamicFormField
                                control={form.control}
                                name={'agentReferenceNumber'}
                                type={'text'}
                                label="Agent Reference Number (ARN)"
                                placeholder="AARN1234567"
                            />
                        </div>

                        <DynamicFormField
                            control={form.control}
                            name={'utr'}
                            type={'text'}
                            label="UTR"
                            placeholder="1234567890"
                        />
                        <DynamicFormField
                            control={form.control}
                            name={'nino'}
                            type={'text'}
                            label="NINO"
                            placeholder="AB123456C"
                        />
                        <div className="flex space-x-2 col-span-2">
                            <Button
                                onClick={() => onPrevious()}
                                type="button"
                                variant={'secondary'}
                                size={'xl'}
                                className="text-base  bg-gray-100 text-gray-700  font-medium hover:bg-gray-200"
                            >
                                Back
                            </Button>
                            <div className="flex-1 flex space-x-2">
                                <Button
                                    size={'xl'}
                                    type="button"
                                    variant={'secondary'}
                                    className="flex-1 text-base bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                                    onClick={() => setStep('step6')}
                                >
                                    Skip
                                </Button>
                                <div className="flex-1">
                                    <Button
                                        type="button"
                                        size={'xl'}
                                        className="text-base w-full"
                                        onClick={() => setStep('step5')}
                                    >
                                        Connect to HMRC
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}
