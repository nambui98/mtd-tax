import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import { CheckIcon } from 'lucide-react';
import React from 'react';

type Props = {};

export default function DialogConnectHMRC({}: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Connect to HMRC</Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckIcon className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        HMRC Connection Successful
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Your agency is now authorized to submit MTD returns on
                        behalf of your clients.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left mb-6">
                        <div className="text-sm text-green-700">
                            <p className="font-medium mb-2">
                                Connection Details:
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    <span className="font-medium">ARN:</span>{' '}
                                    AARN1234567
                                </li>
                                <li>
                                    <span className="font-medium">Status:</span>{' '}
                                    Active
                                </li>
                                <li>
                                    <span className="font-medium">
                                        Services:
                                    </span>{' '}
                                    MTD Income Tax, MTD VAT
                                </li>
                            </ul>
                        </div>
                    </div>

                    <DialogClose>
                        <Button size={'xl'} className="w-full text-base">
                            Continue Setup
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
