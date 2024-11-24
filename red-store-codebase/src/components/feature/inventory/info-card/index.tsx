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
    <Card className="flex flex-col p-1 sm:p-1 border border-gray-200 shadow-md rounded-md hover:shadow-lg transition-shadow duration-200 my-5">
      <CardHeader className="flex flex-col">
        <div className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 bg-slate-900 rounded-full mb-1">
          <Icon className="text-lg sm:text-lg text-white" />
        </div>
        <h3 className="text-sm sm:text-base md:text-lg text-gray-700">
          {heading}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-3xl">{description}</p>
      </CardContent>
    </Card>
  );
};

const InfoCards = () => {
  // State for storing fetched metrics data
  const [avgDailySales, setAvgDailySales] = useState<string>("Loading...");
  const [avgMonthlySales, setAvgMonthlySales] = useState<string>("Loading...");

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
        setAvgDailySales(metrics.avg_daily_sales.toFixed(2)); // Convert to string with 2 decimal places
        setAvgMonthlySales(metrics.avg_monthly_sales.toFixed(2));
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
        description={"6 units"}
      />
      <InfoCard
        icon={Flame}
        heading="Monthly Sales"
        description={`₹ ${avgMonthlySales}`}
      />
      <InfoCard
        icon={Radiation}
        heading="Average Daily Sales"
        description={avgDailySales}
      />
    </div>
  );
};

export default InfoCards;
