'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { DynamicFormField } from '@workspace/ui/components/dynamic-form-field';
import { Form } from '@workspace/ui/components/form';
import { Button } from '@workspace/ui/components/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { signIn } from 'next-auth/react';
import { StepFormData } from './content';
import {
    InsertUser,
    insertUserSchema,
} from '@workspace/database/dist/schema/users';
import { z } from 'zod/v3';
import { useMutation } from '@tanstack/react-query';
import { signInWithPassword, verifyEmail } from '../action';

type Props = {
    onPrevious: VoidFunction;
    stepFormData: StepFormData;
    user: InsertUser | null;
    handleSignup: (step3: StepFormData['step3']) => void;
    onNextStep: () => void;
    isSigningUp: boolean;
    isSignupSuccess: boolean;
};

export default function Step3({
    onPrevious,
    user,
    stepFormData,
    handleSignup,
    isSigningUp,
    isSignupSuccess,
    onNextStep,
}: Props) {
    const { mutate: signInWithPasswordMutation, isPending: isSigningIn } =
        useMutation({
            mutationFn: (data: { email: string; password: string }) =>
                signInWithPassword(data),
            onSuccess: () => {
                onNextStep();
            },
        });
    const { mutate: verifyEmailMutation, isPending: isVerifyingEmail } =
        useMutation({
            mutationFn: (data: { otp: string; email: string }) =>
                verifyEmail(data),
            onSuccess: async () => {
                await signIn('local', {
                    redirect: false,
                    email: form.getValues('email'),
                    password: form.getValues('password'),
                });
                onNextStep();
            },
        });
    const form = useForm<InsertUser & { otp?: string }>({
        resolver: zodResolver(
            insertUserSchema.and(
                z.object({
                    otp: z
                        .string()
                        .optional()
                        .refine(
                            (val) => {
                                if (isSignupSuccess) {
                                    return !!val;
                                }
                                return true;
                            },
                            { message: 'OTP is required' },
                        ),
                }),
            ),
        ),
        defaultValues: { ...user },
    });
    function onSubmit(values: InsertUser & { otp?: string }) {
        if (isSignupSuccess) {
            verifyEmailMutation({
                otp: values.otp || '',
                email: values.email || '',
            });
        } else {
            handleSignup(values);
        }
    }
    return (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Administrator Account
                </h2>
                <p className="text-gray-600">Create your admin account</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 ">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" grid grid-cols-2 gap-4 items-start w-full"
                    >
                        {isSignupSuccess ? (
                            <div className="col-span-2 flex flex-col gap-4">
                                <p className="text-lg font-bold text-gray-600 ">
                                    OTP sent to your email
                                </p>
                                <DynamicFormField
                                    control={form.control}
                                    name={'otp'}
                                    type={'text'}
                                    label="OTP"
                                    placeholder="Enter OTP"
                                />
                                <Button
                                    size={'xl'}
                                    className="w-full font-medium text-base"
                                    disabled={isVerifyingEmail || isSigningIn}
                                    type="submit"
                                >
                                    {isSigningIn
                                        ? 'Signing In...'
                                        : isVerifyingEmail
                                          ? 'Verifying OTP...'
                                          : 'Verify OTP'}
                                    {isSigningIn && (
                                        <p className="text-sm text-gray-500">
                                            Please wait while we sign you in.
                                        </p>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <DynamicFormField
                                    control={form.control}
                                    name={'firstName'}
                                    type={'text'}
                                    label="First Name"
                                    placeholder="John"
                                />
                                <DynamicFormField
                                    control={form.control}
                                    name={'lastName'}
                                    type={'text'}
                                    label="Last Name"
                                    placeholder="Doe"
                                />

                                <div className="col-span-2">
                                    <DynamicFormField
                                        control={form.control}
                                        name={'email'}
                                        type={'text'}
                                        label="Email Address"
                                        placeholder="john.doe@company.com"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <DynamicFormField
                                        control={form.control}
                                        name={'phoneNumber'}
                                        type={'text'}
                                        label="Phone Number"
                                        placeholder="+44 20 1234 5678"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <DynamicFormField
                                        control={form.control}
                                        name={'jobTitle'}
                                        type={'text'}
                                        label="Job Title"
                                        placeholder="Managing Director"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <DynamicFormField
                                        control={form.control}
                                        name={'password'}
                                        type={'password'}
                                        label="Password"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <DynamicFormField
                                        control={form.control}
                                        name={'confirmPassword'}
                                        type={'password'}
                                        label="Confirm Password"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                <div className="col-span-2 flex space-x-4 mt-6">
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
                                            disabled={isSigningUp}
                                            type="submit"
                                        >
                                            {isSigningUp
                                                ? 'Signing Up...'
                                                : 'Continue'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </Form>
            </div>
        </>
    );
}
