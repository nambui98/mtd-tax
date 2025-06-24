import type {
    ControllerProps,
    ControllerRenderProps,
    FieldPath,
    FieldValues,
} from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
    RadioGroup,
    RadioGroupItem,
} from '@workspace/ui/components/radio-group';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@workspace/ui/components/command';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import { DateTimePicker } from './date-picker';
import { Icons } from './icons';
import { Switch } from '@workspace/ui/components/switch';
import { Textarea } from '@workspace/ui/components/textarea';

type Option = {
    label: string;
    value: string;
};

type CustomFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
    type:
        | 'checkbox'
        | 'select'
        | 'text'
        | 'email'
        | 'password'
        | 'number'
        | 'switch'
        | 'radio-group'
        | 'date'
        | 'textarea';
    label?: React.ReactNode;
    description?: string;
    options?: Option[];
    selectType?: 'single' | 'multiple';
    placeholder?: string;

    render?: ControllerProps<TFieldValues, TName>['render'];
};

const CustomFormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    name,
    type,
    label,
    description,
    options,
    selectType,
    placeholder,
    control,
    render,
    ...props
}: CustomFormFieldProps<TFieldValues, TName>) => {
    const isRequired = props.rules?.required;
    const renderField = (field: ControllerRenderProps<TFieldValues, TName>) => {
        switch (type) {
            case 'text':
                return (
                    <Input type="text" placeholder={placeholder} {...field} />
                );
            case 'email':
                return (
                    <Input type="email" placeholder={placeholder} {...field} />
                );
            case 'password':
                return (
                    <Input
                        type="password"
                        placeholder={placeholder}
                        {...field}
                    />
                );
            case 'checkbox':
                return (
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                );
            case 'number':
                return (
                    <Input type="number" placeholder={placeholder} {...field} />
                );
            case 'switch':
                return <Switch />;
            case 'date':
                return (
                    <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        disabledDate={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                        }
                    />
                    // <Popover>
                    //   <PopoverTrigger asChild>
                    //     <FormControl>
                    //       <Button
                    //         variant="outline"
                    //         size="xl"
                    //         role="combobox"
                    //         className={cn(
                    //           'w-full font-medium rounded-[12px] text-sm text-black justify-between bg-white/80',
                    //           !field.value && 'text-80-black/50',
                    //         )}
                    //       >
                    //         {field.value
                    //           ? (
                    //               format(field.value, 'PPP')
                    //             )
                    //           : (
                    //               <span>Pick a date</span>
                    //             )}
                    //         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    //       </Button>
                    //     </FormControl>
                    //   </PopoverTrigger>
                    //   <PopoverContent className="w-auto p-0" align="start">
                    //     <Calendar
                    //       mode="single"
                    //       selected={field.value}
                    //       onSelect={field.onChange}
                    //       disabled={date =>
                    //         date > new Date() || date < new Date('1900-01-01')}
                    //       initialFocus
                    //     />
                    //   </PopoverContent>
                    // </Popover>
                );
            case 'select':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="lg"
                                role="combobox"
                                className={cn(
                                    'w-full font-medium rounded-[12px] text-sm text-black justify-between bg-white/80',
                                    !field.value && 'text-80-black/50',
                                )}
                            >
                                {field.value
                                    ? options?.find(
                                          (option) =>
                                              option.value === field.value,
                                      )?.label
                                    : placeholder}
                                <Icons.arrowDown className="ml-2 h-5 w-5 shrink-0 text-40-black" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0"
                            style={{
                                width: 'var(--radix-popover-trigger-width)',
                            }}
                        >
                            <Command>
                                <CommandInput placeholder={placeholder} />
                                <CommandList>
                                    <CommandEmpty>
                                        No options found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {options?.map((option) => (
                                            <CommandItem
                                                value={option.label}
                                                key={option.value}
                                                onSelect={() => {
                                                    field.onChange(
                                                        option.value,
                                                    );
                                                }}
                                            >
                                                {option.label}
                                                <Check
                                                    className={cn(
                                                        'ml-auto',
                                                        option.value ===
                                                            field.value
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                );
            case 'radio-group':
                return (
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-2"
                    >
                        {options?.map((option) => (
                            <FormItem
                                key={option.value}
                                className="flex items-center gap-3"
                            >
                                <FormControl>
                                    <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {option.label}
                                </FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                );
            case 'textarea':
                return <Textarea placeholder={placeholder} {...field} />;
            default:
                return <input name={name} />;
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={
                render ||
                (({ field }) => (
                    <FormItem>
                        {label && type !== 'checkbox' && type !== 'switch' && (
                            <FormLabel className="h-fit  min-h-5">
                                {label}{' '}
                                {isRequired && (
                                    <span className="text-red-500">*</span>
                                )}
                            </FormLabel>
                        )}
                        <div className="flex items-center gap-2 h-fit">
                            <FormControl>{renderField(field)}</FormControl>
                            {(type === 'checkbox' || type === 'switch') && (
                                <FormLabel>
                                    {label}{' '}
                                    {isRequired && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </FormLabel>
                            )}
                        </div>
                        {description && (
                            <FormDescription>{description}</FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                ))
            }
            {...props}
        />
    );
};

export default CustomFormField;
