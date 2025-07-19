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
import { Button, LoadingButton } from '@workspace/ui/components/button';
import { Loader2, Plus, Save, X } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import {
    InsertClient,
    insertClientSchema,
} from '@workspace/database/dist/schema/clients';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { clientsService, AgencyRelationshipResponse } from '@/services/clients';
import RelationshipPopup from './relationship-popup';
import TestData from './test-data';
import { useSession } from 'next-auth/react';

// const formSchema = z.object({
//     clientType: z.string().min(1, { message: 'Client Type is required' }),
//     mtdStatus: z.boolean(),
//     title: z.string().min(1, { message: 'Title is required' }),
//     firstName: z.string().min(1, { message: 'First Name is required' }),
//     lastName: z.string().min(1, { message: 'Last Name is required' }),
//     dob: z.coerce.date({
//         message: 'Date of Birth is required',
//     }),
//     nino: z
//         .string()
//         .min(1, { message: 'National Insurance Number is required' }),
//     utr: z.string().min(1, { message: 'UTR is required' }),
//     email: z.string().email({ message: 'Invalid email address' }),
//     phone: z.string().min(1, { message: 'Phone Number is required' }),
//     addressLine1: z.string().min(1, { message: 'Address Line 1 is required' }),
//     addressLine2: z.string(),
//     city: z.string().min(1, { message: 'City/Town is required' }),
//     county: z.string(),
//     postcode: z.string().min(1, { message: 'Postcode is required' }),
//     assignedTo: z.string().optional(),
//     clientCategory: z.string().optional(),
//     notes: z.string().optional(),
//     sendWelcomeEmail: z.boolean(),
//     hmrcAuthorization: z.boolean(),
// });
type Props = {};

export default function MainContent({}: Props) {
    const router = useRouter();
    const [showRelationshipPopup, setShowRelationshipPopup] =
        React.useState(false);
    const [relationshipData, setRelationshipData] =
        React.useState<AgencyRelationshipResponse | null>(null);
    const [isCheckingRelationship, setIsCheckingRelationship] =
        React.useState(false);
    const [currentUtr, setCurrentUtr] = React.useState<string>('');
    const { data: session } = useSession();

    const form = useForm<InsertClient>({
        resolver: zodResolver(insertClientSchema),
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
            phoneNumber: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            county: '',
            postcode: '',
            assignedTo: '',
            clientCategory: 'standard',
            notes: '',
            sendWelcomeEmail: true,
            hmrcAuthorization: false,
        },
    });

    const { data: staffUsers } = useQuery({
        queryKey: ['staff-users'],
        queryFn: () => usersService.getStaffUsers(),
    });

    // Function to fill form with test data
    const handleFillForm = (data: any) => {
        form.reset(data);
    };

    const { mutate: createClient, isPending } = useMutation({
        mutationFn: (client: InsertClient) => usersService.createClient(client),
        onSuccess: async (client) => {
            toast.success('Client created successfully');
            debugger;
            // Check agency relationship after successful client creation
            if (client.utr) {
                setIsCheckingRelationship(true);
                try {
                    // For demo purposes, using a sample ARN - in production, get from user profile
                    setCurrentUtr(client.utr);

                    const relationship =
                        await clientsService.checkAgencyRelationship(
                            client.utr,
                            session?.user.agentReferenceNumber as string,
                        );
                    debugger;
                    setRelationshipData(relationship);

                    setShowRelationshipPopup(true);
                } catch (error) {
                    console.error(
                        'Failed to check agency relationship:',
                        error,
                    );
                    toast.error(
                        'Failed to check agency relationship. You can check this later.',
                    );
                    // Continue with navigation even if relationship check fails
                    router.push('/dashboard/clients');
                } finally {
                    setIsCheckingRelationship(false);
                }
            } else {
                router.push('/dashboard/clients');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create client');
        },
    });

    const { mutate: requestRelationship, isPending: isRequestingRelationship } =
        useMutation({
            mutationFn: async () => {
                // Use the real HMRC API to request a relationship
                if (!currentUtr) {
                    throw new Error('Missing UTR or Agency ID');
                }

                // You can optionally pass a known fact (like postcode) for additional verification
                const knownFact = form.getValues('postcode'); // Use postcode as known fact

                return await clientsService.requestAgencyRelationship(
                    currentUtr,
                    knownFact,
                );
            },
            onSuccess: (result) => {
                if (result.success) {
                    toast.success(
                        result.message ||
                            'Relationship request sent successfully',
                    );
                } else {
                    toast.error(
                        result.message || 'Failed to send relationship request',
                    );
                }
                setShowRelationshipPopup(false);
                router.push('/dashboard/clients');
            },
            onError: (error: any) => {
                console.error('Relationship request error:', error);
                toast.error(error.message || 'Failed to request relationship');
            },
        });

    const handleCloseRelationshipPopup = () => {
        setShowRelationshipPopup(false);
        router.push('/dashboard/clients');
    };

    const handleRequestRelationship = () => {
        requestRelationship();
    };

    console.log(staffUsers);
    const onSubmit = (values: InsertClient) => {
        console.log(values);
        debugger;
        createClient(values);
    };
    console.log(form.formState.errors);
    return (
        <>
            {/* Test Data Component - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
                <TestData onFillForm={handleFillForm} staffUsers={staffUsers} />
            )}

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
                        <div className="grid grid-cols-3 gap-4 items-start">
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
                                name="phoneNumber"
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
                        <div className="grid grid-cols-3 gap-4 items-start">
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
                        <div className="grid grid-cols-2 gap-4 items-start">
                            <CustomFormField
                                control={form.control}
                                name="assignedTo"
                                label="Assigned To Staff Member"
                                placeholder="Select Staff Member"
                                type="select"
                                rules={{
                                    required: {
                                        value: true,
                                        message:
                                            'Assigned To Staff Member is required',
                                    },
                                }}
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
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                        <Button type="button" variant="outline" size="lg">
                            <X />
                            Cancel
                        </Button>
                        <Button type="button" variant="outline" size="lg">
                            <Save />
                            Save as Draft
                        </Button>
                        <LoadingButton
                            type="submit"
                            variant="default"
                            size="lg"
                            disabled={isPending}
                            isLoading={isPending}
                        >
                            <Plus />
                            Add Client
                        </LoadingButton>
                    </div>
                </form>
            </Form>

            <RelationshipPopup
                isOpen={showRelationshipPopup}
                onClose={handleCloseRelationshipPopup}
                relationshipData={relationshipData}
                onRequestRelationship={handleRequestRelationship}
                isLoading={isRequestingRelationship}
                isCheckingRelationship={isCheckingRelationship}
            />
        </>
    );
}
