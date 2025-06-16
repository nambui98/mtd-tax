/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useMutation } from '@tanstack/react-query';
import {
    InsertCompany,
    InsertHMRC,
    InsertUser,
    PracticeType,
} from '@workspace/database';
import { useState } from 'react';
import { toast } from 'sonner';
import { signup } from '../action';
import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import Step4 from './step-4';
import Step5 from './step-5';
import Step6 from './step-6';
import StepProgress from './step-progress';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export type Step = 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';
export type StepFormData = {
    step1: {
        practiceType: PracticeType | null;
    };
    step2: InsertCompany | null;
    step3: InsertUser | null;
    step4: InsertHMRC | null;
};
export default function Content({ step: initialStep }: { step?: Step }) {
    const [step, setStep] = useState<Step>(initialStep || 'step1');
    const [stepFormData, setStepFormData] = useState<StepFormData>({
        step1: {
            practiceType: null,
        },
        step2: null,
        step3: null,
        step4: null,
    });
    const router = useRouter();
    const {
        mutate: signupMutation,
        isPending: isSigningUp,
        isSuccess: isSignupSuccess,
    } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success('Signup successful');
            signIn('local', {
                redirect: false,
                email: stepFormData.step3?.email || '',
                password: stepFormData.step3?.password || '',
            });
            setStep('step4');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSignup = async (step3: StepFormData['step3']) => {
        setStepFormData((prev) => ({
            ...prev,
            step3,
        }));
        const data: {
            user: InsertUser & InsertHMRC;
            company: InsertCompany;
        } = {
            user: {
                ...stepFormData.step1!,
                ...step3!,
                ...stepFormData.step4!,
            },
            company: {
                ...stepFormData.step2!,
            },
        };
        signupMutation(data);
    };
    const getCurrentStep = () => {
        const mapStepToComponent = {
            step1: (
                <Step1
                    onNextStep={(value: Step) => setStep(value)}
                    setStepFormData={setStepFormData}
                    practiceType={stepFormData.step1.practiceType}
                />
            ),
            step2: (
                <Step2
                    onPrevious={() => setStep('step1')}
                    onNextStep={(value: Step) => setStep(value)}
                    setStepFormData={setStepFormData}
                    company={stepFormData.step2}
                />
            ),
            step3: (
                <Step3
                    onPrevious={() => setStep('step2')}
                    setStepFormData={setStepFormData}
                    handleSignup={handleSignup}
                    isSigningUp={isSigningUp}
                    isSignupSuccess={isSignupSuccess}
                    user={stepFormData.step3}
                    onNextStep={() => setStep('step4')}
                />
            ),
            step4: (
                <Step4
                    onPrevious={() => setStep('step3')}
                    setStep={setStep}
                    setStepFormData={setStepFormData}
                    user={stepFormData.step3}
                />
            ),
            step5: <Step5 onNext={() => setStep('step6')} />,
            step6: <Step6 />,
        };
        return mapStepToComponent[step];
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
            {step !== 'step1' && step !== 'step5' && step !== 'step6' && (
                <StepProgress currentStep={step} />
            )}
            {getCurrentStep()}
        </div>
    );
}
