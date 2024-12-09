"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const productsData = [
  { name: "Product A", sales: 500 },
  { name: "Product B", sales: 300 },
  { name: "Product C", sales: 700 },
  { name: "Product D", sales: 200 },
  { name: "Product E", sales: 900 },
  { name: "Product F", sales: 1000 },
  { name: "Product G", sales: 50 },
  { name: "Product H", sales: 150 },
  { name: "Product I", sales: 350 },
  { name: "Product J", sales: 800 },
  { name: "Product K", sales: 600 },
  { name: "Product L", sales: 450 },
  { name: "Product M", sales: 250 },
  { name: "Product N", sales: 100 },
  { name: "Product O", sales: 550 },
];

const chartData = [
  { day: "Monday", revenue: 2000, avg: 50 },
  { day: "Tuesday", revenue: 3000, avg: 60 },
  { day: "Wednesday", revenue: 4000, avg: 70 },
  { day: "Thursday", revenue: 2500, avg: 40 },
  { day: "Friday", revenue: 3200, avg: 75 },
  { day: "Saturday", revenue: 5000, avg: 100 },
  { day: "Sunday", revenue: 4500, avg: 90 },
];

const chartConfig = {
  revenue: {
    label: "revenue",
    color: "#2563eb",
  },
  avg: {
    label: "average",
    color: "#60a5fa",
  },
};

const AnalyticsPage = () => {
  const sortedProducts = [...productsData].sort((a, b) => b.sales - a.sales);
  const topProducts = sortedProducts.slice(0, 10);
  const bottomProducts = sortedProducts.slice(-10);
  const [showTopProducts, setShowTopProducts] = useState(true);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Individual Store Dashboard</h1>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1800px]">
        {/* Store Revenue Line Chart */}
        <ChartContainer
          config={chartConfig}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Store Revenue
            </h3>
            <LineChart
              data={chartData}
              width={650}
              height={300}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#000000" // Replace this with your desired color
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </>
        </ChartContainer>

        {/* Mean Transaction Value Bar Chart */}
        <ChartContainer
          config={chartConfig}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Mean Transaction Value
            </h3>
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
              <Bar
                dataKey="avg"
                fill="var(--color-secondary)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </>
        </ChartContainer>

        {/* Sales Frequency by Time */}
        <ChartContainer
          config={chartConfig}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Sale Frequency by Time
            </h3>
            <BarChart
              data={[
                { hour: "9 AM", freq: 10 },
                { hour: "12 PM", freq: 50 },
                { hour: "3 PM", freq: 30 },
                { hour: "6 PM", freq: 40 },
                { hour: "9 PM", freq: 20 },
              ]}
              width={650}
              height={300}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="freq"
                fill="var(--color-accent)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </>
        </ChartContainer>

        {/* Product List Display */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <button
            className="bg-slate-600 text-white font-semibold px-4 py-2 rounded-md mb-4"
            onClick={() => setShowTopProducts(!showTopProducts)}
          >
            {showTopProducts ? "Show Bottom 10" : "Show Top 10"}
          </button>
          <h3 className="text-lg font-semibold mb-4 text-center">
            {showTopProducts
              ? "Top 10 Best-Selling Products"
              : "Bottom 10 Selling Products"}
          </h3>
          <ul className="space-y-2">
            {(showTopProducts ? topProducts : bottomProducts).map(
              (product, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
                >
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.sales} units</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
