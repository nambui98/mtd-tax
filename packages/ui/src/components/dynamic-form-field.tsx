'use client';
import React from 'react';
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Switch } from '@workspace/ui/components/switch';
import { Textarea } from '@workspace/ui/components/textarea';

type FieldType =
    | 'checkbox'
    | 'select'
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'switch'
    | 'date'
    | 'textarea'
    | 'upload'
    | 'datetime'
    | 'array';

export type Option = {
    label: string;
    value: string;
};

type Props<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
    type: FieldType;
    label?: React.ReactNode;
    description?: string;
    options?: Option[];
    placeholder?: string;
};

export const DynamicFormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    type,
    label,
    description,
    options,
    placeholder,
    control,
    ...props
}: Props<TFieldValues, TName>) => {
    const renderField = ({ field }: { field: any }) => {
        switch (type) {
            case 'checkbox':
                return (
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        {...props}
                    />
                );
            case 'select':
                return (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options?.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'switch':
                return (
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        {...props}
                    />
                );
            case 'textarea':
                return (
                    <Textarea placeholder={placeholder} {...field} {...props} />
                );
            case 'date':
            case 'datetime':
                return (
                    <Input
                        type={type === 'datetime' ? 'datetime-local' : 'date'}
                        placeholder={placeholder}
                        {...field}
                        {...props}
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={placeholder}
                        {...field}
                        {...props}
                    />
                );
            case 'email':
                return (
                    <Input
                        type="email"
                        placeholder={placeholder}
                        {...field}
                        {...props}
                    />
                );
            case 'password':
                return (
                    <Input
                        type="password"
                        placeholder={placeholder}
                        {...field}
                        {...props}
                    />
                );
            case 'text':
            default:
                return (
                    <Input
                        type="text"
                        placeholder={placeholder}
                        {...field}
                        {...props}
                    />
                );
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>{renderField({ field })}</FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
