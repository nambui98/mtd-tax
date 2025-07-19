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
import { FilterIcon, RefreshCcwIcon, SearchIcon } from 'lucide-react';
import CustomFormField from '@/components/custom-form-field';
import { Button } from '@workspace/ui/components/button';

const formSchema = z.object({
    client: z.string(),
    search: z.string(),
    submissionType: z.string(),
    status: z.string(),
    assignee: z.string(),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
    quarter: z.string(),
});

type SubmissionsFilterProps = {
    onFilter: (filters: {
        search?: string;
        submissionType?: string;
        status?: string;
        assignee?: string;
        dateRange?: {
            from: Date;
            to: Date;
        };
        quarter?: string;
    }) => void;
};

export default function SubmissionsFilter({
    onFilter,
}: SubmissionsFilterProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: '',
            search: '',
            submissionType: '',
            status: '',
            assignee: '',
            dateRange: undefined,
            quarter: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        onFilter(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onChange={() => {
                    onFilter(form.getValues());
                }}
                className="bg-white rounded-lg shadow p-5 mb-6 grid grid-cols-4 gap-4"
            >
                <CustomFormField
                    control={form.control}
                    name="client"
                    label="Client"
                    placeholder="All Clients"
                    options={[
                        {
                            label: 'Mr',
                            value: 'mr',
                        },
                        { label: 'Mrs', value: 'mrs' },
                        { label: 'Miss', value: 'miss' },
                        { label: 'Ms', value: 'ms' },
                        { label: 'Dr', value: 'dr' },
                        { label: 'Other', value: 'other' },
                    ]}
                    type="select"
                />
                <CustomFormField
                    control={form.control}
                    name="submissionType"
                    label="Submission Type"
                    placeholder="All Types"
                    options={[
                        {
                            label: 'Quarterly Update',
                            value: 'quarterly',
                        },
                        { label: 'Annual Declaration', value: 'annual' },
                    ]}
                    type="select"
                />
                <CustomFormField
                    control={form.control}
                    name="status"
                    label="Status"
                    placeholder="All Statuses"
                    options={[
                        {
                            label: 'Submitted',
                            value: 'submitted',
                        },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Draft', value: 'draft' },
                        { label: 'In Progress', value: 'inprogress' },
                        { label: 'Rejected', value: 'rejected' },
                        { label: 'Error', value: 'error' },
                    ]}
                    type="select"
                />
                <CustomFormField
                    control={form.control}
                    name="assignee"
                    label="Assigned To"
                    placeholder="All Staff"
                    options={[
                        {
                            label: 'Mr',
                            value: 'mr',
                        },
                        { label: 'Mrs', value: 'mrs' },
                        { label: 'Miss', value: 'miss' },
                        { label: 'Ms', value: 'ms' },
                        { label: 'Dr', value: 'dr' },
                        { label: 'Other', value: 'other' },
                    ]}
                    type="select"
                />
                <CustomFormField
                    control={form.control}
                    name="dateRange"
                    label="Date Range"
                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                    type="date-range"
                />
                <CustomFormField
                    control={form.control}
                    name="quarter"
                    label="Quarter"
                    placeholder="All Quarters"
                    options={[
                        {
                            label: 'Q1 (Apr - Jun)',
                            value: 'q1',
                        },
                        { label: 'Q2 (Jul - Sep)', value: 'q2' },
                        { label: 'Q3 (Oct - Dec)', value: 'q3' },
                        { label: 'Q4 (Jan - Mar)', value: 'q4' },
                    ]}
                    type="select"
                />
                <CustomFormField
                    control={form.control}
                    name="search"
                    label="Search"
                    placeholder="Search submissions..."
                    type="text"
                />
                <div className="flex justify-end col-span-4 gap-4">
                    <Button
                        type="button"
                        size="lg"
                        onClick={() => {
                            form.reset();
                        }}
                        variant="outline"
                        className="text-base"
                    >
                        Reset Filters <RefreshCcwIcon className="w-4 h-4" />
                    </Button>
                    <Button type="submit" size="lg" className="text-base">
                        <FilterIcon className="w-4 h-4" />
                        Apply Filters
                    </Button>
                </div>
            </form>
        </Form>
    );
}
