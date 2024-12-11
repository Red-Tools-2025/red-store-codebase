"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  IndianRupee,
  UserRoundCheck,
  UserRoundX,
  Radiation,
  Store as StoreIcon,
  Flame,
} from "lucide-react";

interface InfoCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  heading: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  heading,
  description,
}) => {
  return (
    <Card className="flex flex-col p-1 sm:p-1 border border-gray-200 shadow-md rounded-md hover:shadow-lg transition-shadow duration-200 my-5 bg-[#F9FAFB]">
      <CardHeader className="flex flex-col">
        <div className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 bg-slate-900 rounded-full mb-1">
          <Icon className="text-lg sm:text-lg text-white " />
        </div>
        <h3 className="text-base sm:text-lg font-inter md:text-xl lg:text-3xl text-gray-500">
          {heading}
        </h3>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-sm font-inter text-gray-700 sm:text-3xl">
          {/* Show the number */}
          <span className="relative font-inter">
            {description.split(" ")[0]} {/* Show the number */}
            {/* Check for units and position them at the bottom-right */}
            {heading === "Total Stock Quantity" &&
              description.includes("units") && (
                <span className="absolute font-inter  bottom-[-4px] right-[-40px] text-lg text-gray-500">
                  units
                </span>
              )}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

const InfoCards = () => {
  // State for storing fetched metrics data
  const [avgDailySales, setAvgDailySales] = useState<string>("Loading...");
  const [avgMonthlySales, setAvgMonthlySales] = useState<string>("Loading...");

  // Function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString(); // This formats the number with commas
  };

  useEffect(() => {
    // Fetch the metrics data from the API
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/inventory/timeseries/metrics?store_id=7"
        );
        const data = await response.json();
        // Assuming data structure: { "data": [{ "avg_daily_sales": number, "avg_monthly_sales": number }] }
        const metrics = data.data[0];

        // Format the numbers with commas and update the state
        setAvgDailySales(formatNumber(metrics.avg_daily_sales));
        setAvgMonthlySales(formatNumber(metrics.avg_monthly_sales));
      } catch (error) {
        console.error("Failed to fetch metrics data:", error);
        setAvgDailySales("Error");
        setAvgMonthlySales("Error");
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoCard
        icon={IndianRupee}
        heading="Total Stock Value"
        description={"₹6"}
      />
      <InfoCard
        icon={UserRoundCheck}
        heading="Total Stock Quantity"
        description={"756 units"}
      />
      <InfoCard
        icon={Flame}
        heading="Monthly Sales"
        description={`₹${avgMonthlySales}`}
      />
      <InfoCard
        icon={Radiation}
        heading="Average Daily Sales"
        description={`₹${avgDailySales}`}
      />
    </div>
  );
};

export default InfoCards;
