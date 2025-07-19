'use client';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { PlusIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users';

type Props = {
    onFilter: (filters: {
        search?: string;
        businessType?: string;
        assignee?: string;
    }) => void;
};
const formSchema = z.object({
    search: z.string(),
    status: z.string(),
    businessType: z.string(),
    assignee: z.string(),
});

export default function Filter({ onFilter }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: '',
            status: '',
            businessType: '',
            assignee: '',
        },
    });
    const { data: staffUsers } = useQuery({
        queryKey: ['staff-users'],
        queryFn: () => usersService.getStaffUsers(),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        onFilter(values);
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={() => {
                        onFilter(form.getValues());
                    }}
                    className="flex justify-between items-center px-4 py-3 border-b border-gray-200 gap-4"
                >
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="flex-1 max-w-md relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="pl-9"
                                        placeholder="Search clients..."
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="compliant">
                                                    MTD Ready
                                                </SelectItem>
                                                <SelectItem value="warning">
                                                    Action Needed
                                                </SelectItem>
                                                <SelectItem value="danger">
                                                    Critical Issues
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Business Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="self-employed">
                                                    Self-Employed
                                                </SelectItem>
                                                <SelectItem value="property">
                                                    Property
                                                </SelectItem>
                                                <SelectItem value="foreign">
                                                    Foreign Income
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assignee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Assignees" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staffUsers?.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.firstName}{' '}
                                                        {user.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Link
                            href="/dashboard/clients/add"
                            className="px-3 py-2 bg-primary text-white text-[0.875rem] font-medium rounded-md flex items-center gap-2"
                        >
                            <PlusIcon className="size-4" /> Add Client
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
