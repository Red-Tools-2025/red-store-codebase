"use client";

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

const StoreRevenueChart = ({ storeId }: { storeId: number }) => {
  const { data: chartData, loading, error } = useStoreRevenueData(storeId);

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

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#000000",
    },
  };

  return (
    <ChartContainer className="h-[30vh] w-full max-h-full" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
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
  );
};

export default StoreRevenueChart;
