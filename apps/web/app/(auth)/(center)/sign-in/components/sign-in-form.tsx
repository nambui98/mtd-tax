'use client';
import type { AxiosErrorData } from '@/services/api';
import CustomFormField from '@/components/custom-form-field';
import { Icons } from '@/components/icons';
import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField } from '@workspace/ui/components/form';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authService } from '@/services/auth';

// Create a validation schema factory function to dynamically update validation rules
const createSignInFormSchema = (isOtpRequired: boolean) =>
    z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        otp: isOtpRequired
            ? z
                  .string({ required_error: 'OTP is required' })
                  .min(8, { message: 'OTP must be 8 digits' })
                  .max(8)
            : z.string().optional(),
        rememberMe: z.boolean().optional(),
    });

export default function SignInForm() {
    const router = useRouter();

    const requestOtpMutation = useMutation({
        mutationFn: (email: string) => authService.requestOtp(email),
        onSuccess: (data) => {
            if (data.session) {
                toast.success('Verification code sent', {
                    description:
                        'Please check your email for the verification code',
                });
            }
        },
        onError: (error: AxiosErrorData) => {
            toast.error('Failed to send verification code', {
                description:
                    error.message || 'An error occurred. Please try again.',
            });
        },
    });

    // Create validation schema based on whether OTP is required
    const signInFormSchema = createSignInFormSchema(
        !!requestOtpMutation.data?.session,
    );
    type TSignInFormSchema = z.infer<typeof signInFormSchema>;
    const form = useForm<TSignInFormSchema>({
        mode: 'onChange',
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            otp: '',
            rememberMe: false,
        },
        // values: {
        //   email: '',
        //   otp: '',
        //   rememberMe: false,
        //   loginMethod: isSupported ? 'passkey' : 'otp',
        // },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: ({
            email,
            otp,
            session,
        }: {
            email: string;
            otp: string;
            session: string;
        }) =>
            signIn('email-otp', {
                redirect: false,
                email,
                otp,
                session,
            }),
        onSuccess: async (data) => {
            if (data?.ok) {
                toast.success('Signed in successfully');
                router.refresh();
            } else {
                toast.error('Verification failed', {
                    description:
                        data?.error || 'Please check the code and try again',
                });
            }
        },
        onError: (error: AxiosErrorData) => {
            toast.error('Verification failed', {
                description:
                    error.message || 'An error occurred. Please try again.',
            });
        },
    });

    // Request OTP
    const handleRequestOtp = (email: string) => {
        debugger;
        if (!email) {
            form.setError('email', {
                type: 'manual',
                message: 'Please enter your email address',
            });
            return;
        }

        requestOtpMutation.mutate(email);
    };

    // Verify OTP
    const handleVerifyOtp = (otp?: string) => {
        const email = form.getValues('email');
        if (!otp || otp.length !== 8) {
            form.setError('otp', {
                type: 'manual',
                message: 'Please enter the 8-digit verification code',
            });
            return;
        }
        if (!requestOtpMutation.data?.session) {
            toast.error('Session expired', {
                description: 'Please request a new verification code',
            });
            return;
        }

        verifyOtpMutation.mutate({
            email,
            otp,
            session: requestOtpMutation.data.session,
        });
    };

    const onSubmit = (data: TSignInFormSchema) => {
        if (requestOtpMutation.data?.session) {
            handleVerifyOtp(data.otp);
        } else {
            handleRequestOtp(data.email);
        }
    };
    console.log(requestOtpMutation.data?.session);
    return (
        <div className="max-w-md w-full space-y-8">
            <div className="text-center">
                <div className="flex justify-center items-center mb-8">
                    <div className="text-3xl font-semibold text-primary mr-3">
                        TAXAPP
                    </div>
                    <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded">
                        MTD Ready
                    </div>
                </div>
            </div>
            <div className="max-w-[400px] w-full mx-auto p-6 bg-white box-shadow: 0px 0px 16px 0px #0000001A rounded-[8px]">
                <h1 className="text-2xl font-bold text-black leading-8 text-center">
                    Welcome Back
                </h1>
                <p className="text-sm font-medium text-black leading-5 text-center mt-2">
                    Sign in to continue to your TaxApp account
                </p>
                <div className="mt-6 space-y-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 mt-6"
                        >
                            <CustomFormField
                                control={form.control}
                                name="email"
                                type="text"
                                placeholder="Enter your email address"
                                disabled={
                                    !!requestOtpMutation.data?.session ||
                                    requestOtpMutation.isPending ||
                                    !!requestOtpMutation.data?.session ||
                                    requestOtpMutation.isPending
                                }
                            />
                            {requestOtpMutation.data ? (
                                <div className="space-y-4">
                                    <CustomFormField
                                        control={form.control}
                                        name="otp"
                                        type="text"
                                        label="Enter verification code"
                                        placeholder="Enter the 8-digit verification code"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full text-base font-semibold leading-6"
                                        size="xl"
                                        disabled={verifyOtpMutation.isPending}
                                    >
                                        {verifyOtpMutation.isPending
                                            ? 'Verifying...'
                                            : 'Verify & Sign in'}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            form.setValue('otp', '');
                                            form.setValue('email', '');
                                            requestOtpMutation.reset();
                                        }}
                                        className="text-xs text-center w-full text-primary hover:underline"
                                    >
                                        Use a different email address
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        type="submit"
                                        className="w-full text-base font-semibold leading-6"
                                        size="xl"
                                        disabled={requestOtpMutation.isPending}
                                    >
                                        {requestOtpMutation.isPending
                                            ? 'Sending code...'
                                            : 'Send Verification Code'}
                                    </Button>
                                </>
                            )}
                        </form>
                    </Form>

                    {/* <div className="flex items-center gap-6 mt-6">
                    <Separator className="flex-1 bg-20-black" />
                    <p className="text-sm font-medium leading-5 text-80-black">
                        or create an account with email
                    </p>
                    <Separator className="flex-1 bg-20-black" />
                </div>
                <div className="flex items-center gap-2 mt-2 justify-center">
                    <Button
                        variant="outline"
                        className="min-w-12 h-12 rounded-full border-[#EA4335]"
                    >
                        <Icons.google className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="min-w-12 h-12 rounded-full border-[#0866FF]"
                    >
                        <Icons.facebook className="size-4 text-[#0866FF]" />
                    </Button>
                    <Button
                        variant="outline"
                        className="min-w-12 h-12 rounded-full border-80-black"
                    >
                        <Icons.apple className="size-4" />
                    </Button>
                </div> */}
                    <div className="flex items-center gap-2 justify-center">
                        <span className="text-sm font-medium leading-[18ppx] text-black">
                            Don&apos;t have an account?
                            <Link
                                href="/registration"
                                className="text-sm font-medium leading-5 text-primary hover:underline"
                            >
                                {' '}
                                Sign up now
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
