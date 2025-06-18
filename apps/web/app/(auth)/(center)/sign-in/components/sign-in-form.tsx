'use client';
import CustomFormField from '@/components/custom-form-field';
import type { AxiosErrorData } from '@/services/api';
import { authService } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Form } from '@workspace/ui/components/form';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Create a validation schema factory function to dynamically update validation rules
const createSignInFormSchema = (loginMethod: 'password' | 'otp') =>
    z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        ...(loginMethod === 'password' && {
            password: z.string({ required_error: 'Password is required' }),
        }),
        ...(loginMethod === 'otp' && {
            otp: z
                .string({ required_error: 'OTP is required' })
                .length(6, 'OTP must be 6 digits'),
        }),
        rememberMe: z.boolean().optional(),
    });

export default function SignInForm() {
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
    const [otpSent, setOtpSent] = useState(false);

    const requestOtpMutation = useMutation({
        mutationFn: (email: string) => authService.requestLoginOtp(email),
        onSuccess: (data) => {
            debugger;
            setOtpSent(true);
            toast.success('Verification code sent', {
                description:
                    'Please check your email for the verification code',
            });
        },
        onError: (error: AxiosErrorData) => {
            toast.error('Failed to send verification code', {
                description:
                    error.message || 'An error occurred. Please try again.',
            });
        },
    });

    // Create validation schema based on login method
    const signInFormSchema = createSignInFormSchema(loginMethod);
    type TSignInFormSchema = z.infer<typeof signInFormSchema>;

    const form = useForm<TSignInFormSchema>({
        mode: 'onChange',
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
            otp: '',
            rememberMe: false,
        },
    });

    const signInMutation = useMutation({
        mutationFn: async (data: TSignInFormSchema) => {
            if (loginMethod === 'password') {
                return signIn('local', {
                    redirect: false,
                    email: data.email,
                    password: data.password as string,
                });
            } else {
                return signIn('email-otp', {
                    redirect: false,
                    email: data.email,
                    otp: data.otp as string,
                });
            }
        },
        onSuccess: async (data) => {
            if (data?.ok) {
                toast.success('Signed in successfully');
                router.push('/dashboard');
            } else {
                toast.error('Login failed', {
                    description:
                        data?.error ||
                        'Please check your credentials and try again',
                });
            }
        },
        onError: (error: AxiosErrorData) => {
            toast.error('Login failed', {
                description:
                    error.message || 'An error occurred. Please try again.',
            });
        },
    });

    const handleSendOtp = async () => {
        const email = form.getValues('email');
        if (!email) {
            toast.error('Please enter a valid email address');
            return;
        }
        debugger;
        requestOtpMutation.mutate(email);
    };

    const handleResendOtp = () => {
        const email = form.getValues('email');
        if (email) {
            requestOtpMutation.mutate(email);
        }
    };

    const onSubmit = (data: TSignInFormSchema) => {
        signInMutation.mutate(data);
    };

    const toggleLoginMethod = () => {
        setLoginMethod(loginMethod === 'password' ? 'otp' : 'password');
        setOtpSent(false);
        form.reset();
    };

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
                                disabled={signInMutation.isPending}
                            />

                            {/* Main OTP Login Flow */}
                            {loginMethod === 'otp' ? (
                                <div className="space-y-4">
                                    {!otpSent ? (
                                        <Button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="w-full text-base font-semibold leading-6"
                                            size="xl"
                                            disabled={
                                                requestOtpMutation.isPending
                                            }
                                        >
                                            {requestOtpMutation.isPending
                                                ? 'Sending OTP...'
                                                : 'Send Verification Code'}
                                        </Button>
                                    ) : (
                                        <div className="space-y-4">
                                            <CustomFormField
                                                control={form.control}
                                                name="otp"
                                                type="text"
                                                placeholder="Enter 6-digit verification code"
                                                disabled={
                                                    signInMutation.isPending
                                                }
                                            />
                                            <div className="flex justify-between items-center text-sm">
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    className="text-primary hover:underline"
                                                    disabled={
                                                        requestOtpMutation.isPending
                                                    }
                                                >
                                                    {requestOtpMutation.isPending
                                                        ? 'Sending...'
                                                        : 'Resend Code'}
                                                </button>
                                                <span className="text-gray-500">
                                                    Check your email
                                                </span>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full text-base font-semibold leading-6"
                                                size="xl"
                                                disabled={
                                                    signInMutation.isPending
                                                }
                                            >
                                                {signInMutation.isPending
                                                    ? 'Verifying...'
                                                    : 'Verify & Sign In'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Password Login Option */
                                <div className="space-y-4">
                                    <CustomFormField
                                        control={form.control}
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        disabled={signInMutation.isPending}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full text-base font-semibold leading-6"
                                        size="xl"
                                        disabled={signInMutation.isPending}
                                    >
                                        {signInMutation.isPending
                                            ? 'Signing in...'
                                            : 'Sign in with Password'}
                                    </Button>
                                </div>
                            )}

                            {/* Login Method Toggle */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={toggleLoginMethod}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {loginMethod === 'otp'
                                        ? 'Sign in with password instead'
                                        : 'Sign in with verification code instead'}
                                </button>
                            </div>
                        </form>
                    </Form>

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
