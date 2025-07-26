'use client';
import { Button } from '@workspace/ui/components/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Loader2Icon, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
    onConfirm: () => void;
    children: React.ReactNode;
    title: string;
    description: string;
    isLoading: boolean;
    isSuccess: boolean;
};

export default function ConfirmDeletePopover({
    onConfirm,
    children,
    title,
    description,
    isLoading,
    isSuccess,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (isSuccess) {
            setIsOpen(false);
        }
    }, [isSuccess]);
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-4">
                    <p className="text-base font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => {
                                onConfirm();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                                'Delete'
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
