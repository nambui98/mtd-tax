import React from 'react';
import { Step } from './content';
import { cn } from '@workspace/ui/lib/utils';

type Props = {
    currentStep: Step;
};

export default function StepProgress({ currentStep }: Props) {
    const mapStepToIndex = {
        step1: 1,
        step2: 2,
        step3: 3,
        step4: 4,
    };
    return (
        <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
                {Array.from({ length: 4 }).map((_, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <div
                                className={cn('w-12 h-0.5 bg-gray-300 mx-2', {
                                    'bg-primary':
                                        index <=
                                        mapStepToIndex[currentStep] - 1,
                                })}
                            ></div>
                        )}
                        <div
                            className={cn(
                                'w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium',
                                {
                                    'bg-primary text-white':
                                        index <=
                                        mapStepToIndex[currentStep] - 1,
                                },
                            )}
                        >
                            {index + 1}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
