/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useDateRange.ts
import { useState } from "react";

const useDateRange = (defaultStartDate: string, defaultEndDate: string) => {
  const [startDateState, setStartDate] = useState(defaultStartDate);
  const [endDateState, setEndDate] = useState(defaultEndDate);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      setStartDate(formatDate(from)); // Converts properly
      setEndDate(formatDate(to));
    }
  };

  return { startDateState, endDateState, handleDateChange };
};

export default useDateRange;
