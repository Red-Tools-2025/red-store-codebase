"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import useStoreRevenueData from "@/app/hooks/dashboard/useStoreRevenueData";
import { Button } from "@/components/ui/button";

// Helper function to convert month number to month name
const getMonthName = (month: number) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1];
};

const StoreRevenueChart = ({ storeId }: { storeId: number }) => {
  const [availableYearMonthData, setAvailableYearMonthData] = useState<
    { year: number; month: number }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const {
    data: chartData,
    loading,
    error,
  } = useStoreRevenueData(storeId, selectedYear, selectedMonth);

  useEffect(() => {
    // Fetch available year and month data from the API
    const fetchYearMonthData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/get-month-year?store_id=${storeId}`
        );
        const data = await response.json();
        setAvailableYearMonthData(data);

        // Set the default selected year and month based on the fetched data
        if (data.length > 0) {
          const latestData = data[0]; // Take the most recent year and month
          setSelectedYear(latestData.year);
          setSelectedMonth(latestData.month);
        }
      } catch (error) {
        console.error("Failed to fetch year/month data:", error);
      }
    };

    fetchYearMonthData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[30vh] w-full">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[30vh] w-full text-gray-500">
        No data available for this store.
      </div>
    );
  }

  // Skip the first two data points
  
  const filteredChartData = chartData.slice(2);

  const uniqueYears = [
    ...new Set(availableYearMonthData.map((data) => data.year)),
  ];

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#000000",
    },
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <div>
          <label htmlFor="year" className="mr-2">
            Year
          </label>
          <select
            id="year"
            value={selectedYear || ""}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded"
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="mr-2">
            Month
          </label>
          <select
            id="month"
            value={selectedMonth || ""}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded"
          >
            {availableYearMonthData
              .filter((data) => data.year === selectedYear) // Filter months based on selected year
              .map((data) => (
                <option key={data.month} value={data.month}>
                  {getMonthName(data.month)} {/* Use the helper function here */}
                </option>
              ))}
          </select>
        </div>
      </div>

      <ChartContainer
        className="h-[30vh] w-full max-h-full"
        config={chartConfig}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredChartData} // Pass the filtered data
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#cccccc" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={chartConfig.revenue.color}
              strokeWidth={1.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default StoreRevenueChart;
