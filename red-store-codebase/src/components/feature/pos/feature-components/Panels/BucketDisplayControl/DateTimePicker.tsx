"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { DateRange } from "react-day-picker";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  className?: string;
  onDateTimeSelect?: (dateTime: { from: Date; to: Date }) => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export function DateTimePicker({
  className,
  onDateTimeSelect,
}: DateTimePickerProps) {
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: lastMonth,
    to: now,
  });

  const [time, setTime] = React.useState<string | null>(
    now.toTimeString().slice(0, 5) // Default to current time
  );

  const handleDateTimeSelect = () => {
    if (dateRange?.from && dateRange?.to) {
      const [hours, minutes] = (time ?? "00:00").split(":").map(Number);

      // Update the 'to' date with selected time
      const updatedTo = new Date(dateRange.to);
      updatedTo.setHours(hours, minutes);

      onDateTimeSelect?.({ from: dateRange.from, to: updatedTo });
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[250px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </>
              ) : (
                formatDate(dateRange.from)
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
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <TimePicker
          onChange={(value) => setTime(value)}
          value={time}
          disableClock
        />
      </div>

      {/* Go Button */}
      <Button onClick={handleDateTimeSelect} disabled={!dateRange?.from}>
        Go
      </Button>
    </div>
  );
}
