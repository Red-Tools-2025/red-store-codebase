"use client";
import React, { useEffect, useState } from "react";
import { Coins, CalendarClock, ChartSpline, Database } from "lucide-react";
import axios from "axios";
import { useSales } from "@/app/contexts/sales/SalesContext";

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
    <div className="p-5 rounded-lg border my-5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h3>{heading} </h3>
          <div className="bg-blue-500 p-2 rounded-full text-white text-sm">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="relative">
          <p className="text-black text-3xl">
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
        </div>
      </div>
    </div>
  );
};

interface SalesMetricsResponse {
  data: {
    avg_daily_sales: number;
    avg_monthly_sales: number;
  }[];
}

const InfoCards = () => {
  // State for storing fetched metrics data
  const { selectedStore } = useSales();
  const [avgDailySales, setAvgDailySales] = useState<string>("Loading...");
  const [avgMonthlySales, setAvgMonthlySales] = useState<string>("Loading...");

  // Function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString(); // This formats the number with commas
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get<SalesMetricsResponse>(
          `/api/inventory/timeseries/metrics?store_id=${selectedStore?.storeId}`
        );

        console.log({ response });

        if (response.data && response.data.data.length > 0) {
          const metrics = response.data.data[0];

          console.log({ metrics });

          setAvgDailySales(formatNumber(metrics.avg_daily_sales || 0));
          setAvgMonthlySales(formatNumber(metrics.avg_monthly_sales || 0));
        } else {
          setAvgDailySales("0");
          setAvgMonthlySales("0");
        }
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
      <InfoCard icon={Coins} heading="Total Stock Value" description={"₹6"} />
      <InfoCard
        icon={Database}
        heading="Total Stock Quantity"
        description={"756 units"}
      />
      <InfoCard
        icon={CalendarClock}
        heading="Monthly Sales"
        description={`₹${avgMonthlySales}`}
      />
      <InfoCard
        icon={ChartSpline}
        heading="Average Daily Sales"
        description={`₹${avgDailySales}`}
      />
    </div>
  );
};

export default InfoCards;
