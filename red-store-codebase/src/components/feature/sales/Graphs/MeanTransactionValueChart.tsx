"use client";

import { PieChart, Pie, Sector, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useMeanTransactionData from "@/app/hooks/dashboard/useMeanTransactionData"; // Import the custom hook
import { useState } from "react";

interface MeanTransactionChartProps {
  storeId: number;
}

const MeanTransactionChart = ({ storeId }: MeanTransactionChartProps) => {
  const { chartData, loading, error } = useMeanTransactionData(storeId);

  // State to track the hovered sector
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeValue, setActiveValue] = useState<string>("");

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

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
    setActiveValue(data.value);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    setActiveValue("");
  };
const activeShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  ...props
}: any) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={14}>
        {`${value.toFixed(2)}`} {/* Format value to 2 decimal places */}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        fill={chartConfig.avg.color}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        fill={chartConfig.avg.color}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={chartConfig.avg.color}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={chartConfig.avg.color} />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${(percent * 100).toFixed(2)}%`}{" "}
        {/* Format percentage to 2 decimal places */}
      </text>
    </g>
  );
};
  return (
    <ChartContainer className="h-[15vh] w-3/6  max-h-full" config={chartConfig}>
      <PieChart width={650} height={300}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="avg"
          nameKey="month"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          fill={chartConfig.avg.color}
          activeShape={activeShape}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/*   {activeValue || <Label position="center" fill="#333" fontSize={16}>Mean Transaction</Label>} */}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default MeanTransactionChart;
