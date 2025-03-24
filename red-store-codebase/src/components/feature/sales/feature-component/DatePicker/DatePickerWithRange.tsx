"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: string;
  onDateSelect?: (from: Date | undefined, to: Date | undefined) => void;
}

const formatDate = (date: Date | undefined) => {
  if (!date) return "Pick a date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export function DatePickerWithRange({
  className,
  onDateSelect,
}: DatePickerProps) {
  const [fromDate, setFromDate] = React.useState<Date | undefined>();
  const [toDate, setToDate] = React.useState<Date | undefined>();

  const handleSelect = () => {
    if (onDateSelect) {
      console.log(fromDate, toDate);
      onDateSelect(fromDate, toDate);
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      {/* From Date Picker */}
      <Popover>
        <PopoverTrigger asChild className={!fromDate ? "text-gray-400" : ""}>
          <Button
            variant="outline"
            className="w-[150px] justify-start text-left font-normal border-gray-300"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(fromDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={setFromDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* To Date Picker */}
      <Popover>
        <PopoverTrigger asChild className={!fromDate ? "text-gray-400" : ""}>
          <Button
            variant="outline"
            className="w-[150px] justify-start text-left font-normal border-gray-300"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(toDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={setToDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Submit Button */}
      <Button onClick={handleSelect} disabled={!fromDate || !toDate}>
        Go
      </Button>
    </div>
  );
}
