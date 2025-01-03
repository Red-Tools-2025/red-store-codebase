"use client";

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import useSalesFrequencyData from "@/app/hooks/dashboard/useSalesFrequencyData";

const SalesFrequencyChart = ({ storeId }: { storeId: number }) => {
  const { salesFrequencyData, loading, error } = useSalesFrequencyData(storeId);

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

  // Check if salesFrequencyData is empty
  if (!salesFrequencyData || salesFrequencyData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[25vh] w-full text-gray-500">
        No data available for this store.
      </div>
    );
  }

  const chartConfig = {
    freq: {
      label: "Item Sold",
      color: "#2196F3",
    },
  };

  return (
    <ChartContainer className="h-[30vh] w-full max-h-full" config={chartConfig}>
      <BarChart
        data={salesFrequencyData}
        width={650}
        height={300}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="freq" fill="#2196F3" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default SalesFrequencyChart;
