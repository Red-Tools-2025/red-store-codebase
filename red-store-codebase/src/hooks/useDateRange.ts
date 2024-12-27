// hooks/useDateRange.ts
import { useState } from "react";

const useDateRange = (defaultStartDate: string, defaultEndDate: string) => {
  const [startDateState, setStartDate] = useState(defaultStartDate);
  const [endDateState, setEndDate] = useState(defaultEndDate);

  const handleDateChange = (dateRange: any) => {
    if (dateRange && dateRange.from && dateRange.to) {
      setStartDate(dateRange.from.toISOString().split("T")[0]);
      setEndDate(dateRange.to.toISOString().split("T")[0]);
    }
  };

  return { startDateState, endDateState, handleDateChange };
};

export default useDateRange;
