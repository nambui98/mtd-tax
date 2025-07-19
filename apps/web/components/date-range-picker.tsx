import { Button } from '@workspace/ui/components/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@workspace/ui/components/calendar';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { cn } from '@workspace/ui/lib/utils';

// Update Props to handle date range
interface Props {
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
}

export default function DateRangePicker({ dateRange, setDateRange }: Props) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        role="combobox"
                        className={cn(
                            'w-full font-medium rounded-[12px] text-sm text-black justify-between bg-white/80',
                            !dateRange && 'text-80-black/50',
                        )}
                    >
                        {dateRange
                            ? `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`
                            : 'Select date range'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        numberOfMonths={2}
                        selected={dateRange}
                        onSelect={setDateRange}
                        className="rounded-lg border shadow-sm"
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}
