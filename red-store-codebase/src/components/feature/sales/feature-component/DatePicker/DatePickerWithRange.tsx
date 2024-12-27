"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define props for the DatePickerWithRange component
interface DatePickerWithRangeProps {
  className?: string;
  onDateSelect?: (dateRange: DateRange) => void; // Callback function when a date is selected
}

// Helper function to format dates
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export function DatePickerWithRange({
  className,
  onDateSelect,
}: DatePickerWithRangeProps) {
  // Set the initial date range to current date and current date - 1 month
  const currentDate = new Date();
  const lastMonth = new Date(currentDate);
  lastMonth.setMonth(currentDate.getMonth() - 1);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: lastMonth,
    to: currentDate,
  });

  const handleDateSelect = () => {
    if (date && onDateSelect) {
      onDateSelect(date); // Trigger the callback with the selected date range
    }
  };

  return (
    <div className={cn("flex ", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from)} - {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Flex container for date picker button and Done button */}
      <div className="flex items-center pl-2 space-x-2">
        <Button onClick={handleDateSelect} disabled={!date}>
          Go
        </Button>
      </div>
    </div>
  );
}
