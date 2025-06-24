'use client';
import React from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@workspace/ui/components/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomFormField from '@/components/custom-form-field';
import { Switch } from '@workspace/ui/components/switch';
import { Button } from '@workspace/ui/components/button';
import { Plus, Save, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users';

const formSchema = z.object({
    clientType: z.string().min(1, { message: 'Client Type is required' }),
    mtdStatus: z.boolean(),
    title: z.string().min(1, { message: 'Title is required' }),
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    dob: z.coerce.date({
        message: 'Date of Birth is required',
    }),
    nino: z
        .string()
        .min(1, { message: 'National Insurance Number is required' }),
    utr: z.string().min(1, { message: 'UTR is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(1, { message: 'Phone Number is required' }),
    addressLine1: z.string().min(1, { message: 'Address Line 1 is required' }),
    addressLine2: z.string(),
    city: z.string().min(1, { message: 'City/Town is required' }),
    county: z.string(),
    postcode: z.string().min(1, { message: 'Postcode is required' }),
    assignedTo: z.string().optional(),
    clientCategory: z.string().optional(),
    notes: z.string().optional(),
    sendWelcomeEmail: z.boolean(),
    hmrcAuthorization: z.boolean(),
});
type Props = {};

export default function MainContent({}: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientType: 'individual',
            mtdStatus: true,
            title: '',
            firstName: '',
            lastName: '',
            dob: undefined,
            nino: '',
            utr: '',
            email: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            county: '',
            postcode: '',
            assignedTo: '',
            clientCategory: '',
            notes: '',
            sendWelcomeEmail: true,
            hmrcAuthorization: false,
        },
    });

    const { data: staffUsers } = useQuery({
        queryKey: ['staff-users'],
        queryFn: () => usersService.getStaffUsers(),
    });
    console.log(staffUsers);
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white rounded-lg shadow p-8 space-y-8 w-full mx-auto"
                >
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            Client Type
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormField
                                control={form.control}
                                name="clientType"
                                label="Client Type"
                                options={[
                                    {
                                        label: 'Individual (Self-employed)',
                                        value: 'individual',
                                    },
                                    { label: 'Landlord', value: 'landlord' },
                                    { label: 'Both', value: 'both' },
                                ]}
                                type="radio-group"
                            />
                            <FormField
                                control={form.control}
                                name="mtdStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MTD Status</FormLabel>
                                        <div className="flex items-center gap-2">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Subject to MTD for Income Tax
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-3 gap-4 items-start">
                            <CustomFormField
                                control={form.control}
                                name="title"
                                label="Title"
                                placeholder="Select Title"
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
                                rules={{
                                    required: 'Title is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="firstName"
                                label="First Name"
                                placeholder="Enter First Name"
                                type="text"
                                rules={{
                                    required: 'First Name is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="lastName"
                                label="Last Name"
                                placeholder="Enter Last Name"
                                type="text"
                                rules={{
                                    required: 'Last Name is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="dob"
                                label="Date of Birth"
                                placeholder="Select Date of Birth"
                                type="date"
                                rules={{
                                    required: 'Date of Birth is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="nino"
                                label="National Insurance Number"
                                placeholder="Enter National Insurance Number"
                                type="text"
                                description="Format: 2 letters, 6 numbers, 1 letter"
                                rules={{
                                    required:
                                        'National Insurance Number is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="utr"
                                label="Unique Taxpayer Reference (UTR)"
                                placeholder="Enter UTR"
                                type="text"
                                description="10-digit number provided by HMRC"
                                rules={{
                                    required: 'UTR is required',
                                }}
                            />
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            Contact Information
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <CustomFormField
                                control={form.control}
                                name="email"
                                label="Email Address"
                                placeholder="Enter Email Address"
                                type="email"
                                rules={{
                                    required: 'Email Address is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="phone"
                                label="Phone Number"
                                placeholder="Enter Phone Number"
                                type="text"
                                rules={{
                                    required: 'Phone Number is required',
                                }}
                            />
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            Address
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <CustomFormField
                                control={form.control}
                                name="addressLine1"
                                label="Address Line 1"
                                placeholder="Enter Address Line 1"
                                type="text"
                                rules={{
                                    required: 'Address Line 1 is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="addressLine2"
                                label="Address Line 2"
                                placeholder="Enter Address Line 2"
                                type="text"
                            />
                            <CustomFormField
                                control={form.control}
                                name="city"
                                label="City/Town"
                                placeholder="Enter City/Town"
                                type="text"
                                rules={{
                                    required: 'City/Town is required',
                                }}
                            />
                            <CustomFormField
                                control={form.control}
                                name="county"
                                label="County"
                                placeholder="Enter County"
                                type="text"
                            />
                            <CustomFormField
                                control={form.control}
                                name="postcode"
                                label="Postcode"
                                placeholder="Enter Postcode"
                                type="text"
                                rules={{
                                    required: 'Postcode is required',
                                }}
                            />
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            Account Setup
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormField
                                control={form.control}
                                name="assignedTo"
                                label="Assigned To Staff Member"
                                placeholder="Select Staff Member"
                                type="select"
                                options={staffUsers?.map((user) => ({
                                    label: `${user.firstName} ${user.lastName}`,
                                    value: user.id,
                                }))}
                            />
                            <CustomFormField
                                control={form.control}
                                name="clientCategory"
                                label="Client Category"
                                placeholder="Select Category"
                                type="select"
                                options={[
                                    { label: 'Standard', value: 'standard' },
                                    { label: 'Premium', value: 'premium' },
                                    { label: 'VIP', value: 'vip' },
                                ]}
                            />
                            <div className="col-span-2 space-y-4">
                                <CustomFormField
                                    control={form.control}
                                    name="notes"
                                    label="Additional Notes"
                                    placeholder="Enter any additional information about this client"
                                    type="textarea"
                                />
                                <CustomFormField
                                    control={form.control}
                                    name="sendWelcomeEmail"
                                    label="Send welcome email with account setup instructions"
                                    type="checkbox"
                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                            HMRC Authorization
                        </h2>
                        <CustomFormField
                            control={form.control}
                            name="hmrcAuthorization"
                            label="Client has authorized us to act ast agent with HMRC"
                            type="checkbox"
                            description="Note: The client will need to complete HMRC's authorization process before you can submit on their behalf"
                        />
                    </section>
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <Button type="button" variant="outline" size="lg">
                            <X />
                            Cancel
                        </Button>
                        <Button type="button" variant="outline" size="lg">
                            <Save />
                            Save as Draft
                        </Button>
                        <Button type="submit" variant="default" size="lg">
                            <Plus />
                            Add Client
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
