"use client";

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import useMeanTransactionData from "@/app/hooks/dashboard/useMeanTransactionData"; // Import the custom hook

interface MeanTransactionChartProps {
  storeId: number;
}

const MeanTransactionChart = ({ storeId }: MeanTransactionChartProps) => {
  const { chartData, loading, error } = useMeanTransactionData(storeId);

  if (loading)
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
      </div>
    );

  if (error) return <div>{error}</div>;

  // Check if chartData is empty
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 text-gray-500 font-inter">
        No data available for this store.
      </div>
    );
  }

  const chartConfig = {
    avg: {
      label: "Average Transaction Value",
      color: "#000000",
    },
  };

  return (
    <ChartContainer className="h-[30vh] w-full max-h-full" config={chartConfig}>
      <BarChart
        data={chartData}
        width={650}
        height={300}
        margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="avg" fill={chartConfig.avg.color} radius={[5, 5, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default MeanTransactionChart;
