'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { DynamicFormField } from '@workspace/ui/components/dynamic-form-field';
import { Form } from '@workspace/ui/components/form';
import { Button } from '@workspace/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    InsertCompany,
    insertCompanySchema,
} from '@workspace/database/dist/schema/company';
import { Step, StepFormData } from './content';

type Props = {
    onPrevious: VoidFunction;
    onNextStep: (value: Step) => void;
    setStepFormData: React.Dispatch<React.SetStateAction<StepFormData>>;
    company: InsertCompany | null;
};

export default function Step2({
    onPrevious,
    company,
    setStepFormData,
    onNextStep,
}: Props) {
    const form = useForm<InsertCompany>({
        resolver: zodResolver(insertCompanySchema),
        defaultValues: { ...company },
    });
    function onSubmit(values: InsertCompany) {
        setStepFormData((prev) => ({
            ...prev,
            step2: values,
        }));
        onNextStep('step3');
    }
    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Company Information
                </h2>
                <p className="text-gray-600">Tell us about your practice</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <DynamicFormField
                            control={form.control}
                            name={'name'}
                            type={'text'}
                            label="Company Name"
                            placeholder="Enter your company name"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <DynamicFormField
                                control={form.control}
                                name={'companyNumber'}
                                type={'number'}
                                label="Company Number"
                                placeholder="12345678"
                            />
                            <DynamicFormField
                                control={form.control}
                                name={'vatNumber'}
                                type={'number'}
                                label="VAT Number (Optional)"
                                placeholder="GB123456789"
                            />
                        </div>

                        <div>
                            <DynamicFormField
                                control={form.control}
                                name={'addressLine1'}
                                type={'text'}
                                label="Business Address"
                                placeholder="Address Line 1"
                            />
                            <DynamicFormField
                                control={form.control}
                                name={'addressLine2'}
                                type={'text'}
                                placeholder="Address Line 2 (Optional)"
                            />

                            <div className="grid grid-cols-2 gap-4 items-start">
                                <DynamicFormField
                                    control={form.control}
                                    name={'city'}
                                    type={'text'}
                                    placeholder="City"
                                />
                                <DynamicFormField
                                    control={form.control}
                                    name={'postcode'}
                                    type={'text'}
                                    placeholder="Postcode"
                                />
                            </div>
                        </div>
                        <DynamicFormField
                            control={form.control}
                            name={'phoneNumber'}
                            type={'text'}
                            label="Phone Number"
                            placeholder="+44 20 1234 5678"
                        />
                        <div className="flex space-x-4 mt-6">
                            <div className="flex-1">
                                <Button
                                    variant={'secondary'}
                                    size={'xl'}
                                    className="text-base  bg-gray-100 text-gray-700 w-full  font-medium hover:bg-gray-200"
                                    type="button"
                                    onClick={onPrevious}
                                >
                                    Back
                                </Button>
                            </div>
                            <div className="flex-1">
                                <Button
                                    size={'xl'}
                                    className="w-full font-medium text-base"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}
