import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface ApiResponse {
  month: string;
  total_sales: number;
  currency: string;
}

interface SalesOverviewCardProps {
  storeId: number | null | undefined;
}

const fetchData = async (storeId: number): Promise<ApiResponse[]> => {
  try {
    const response = await axios.get<{ data: ApiResponse[] }>(
      "/api/inventory/timeseries/metrics/revenue-monthly",
      { params: { store_id: storeId } }
    );
    return response.data.data; // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error to prevent crashes
  }
};

export const SalesOverviewCard: React.FC<SalesOverviewCardProps> = ({
  storeId,
}) => {
  const [salesData, setSalesData] = useState<ApiResponse[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2024-12-01");
  const [currentSales, setCurrentSales] = useState<number>(0);
  const [previousSales, setPreviousSales] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSales = async () => {
      if (storeId === null || storeId === undefined) return;

      setLoading(true);
      const data = await fetchData(storeId);
      setSalesData(data);
      setLoading(false);

      const latestMonthSales = data.find(
        (item) => item.month === selectedMonth
      );
      setCurrentSales(latestMonthSales?.total_sales || 0);

      const previousMonthSales = data.find(
        (item) => item.month === getPreviousMonth(selectedMonth)
      );
      setPreviousSales(previousMonthSales?.total_sales ?? null);
    };

    fetchSales();
  }, [selectedMonth, storeId]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const getPreviousMonth = (currentMonth: string) => {
    const currentDate = new Date(currentMonth);
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate.toISOString().split("T")[0];
  };

  const salesDifference =
    previousSales !== null ? currentSales - previousSales : 0;
  const salesDifferencePercentage =
    previousSales !== null
      ? ((salesDifference / previousSales) * 100).toFixed(2)
      : null;

  return (
    <Card className="p-4  w-full  lg:w-1/4 bg-white shadow-sm rounded-lg border border-gray-300">
      <CardHeader className="flex flex-row font-inter font-semibold justify-between items-center p-0 border-b border-gray-200 pb-2">
        <div>Monthly Sales Overview</div>
        <div>
          <Select
            onValueChange={handleMonthChange}
            defaultValue={selectedMonth}
          >
            <SelectTrigger className=" w-36 lg:w-24 xl:w-36 text-xs">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              {salesData.map((item) => (
                <SelectItem key={item.month} value={item.month}>
                  {new Date(item.month).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        {storeId === null || storeId === undefined ? (
          <div className="text-gray-500">Store ID is unavailable.</div>
        ) : loading ? (
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
          </div>
        ) : (
          <div>
            <div className=" text-xl lg:text-3xl font-extrabold text-gray-900">
              ₹{currentSales} <span className="text-sm text-gray-500">INR</span>
            </div>
            <CardDescription className="text-sm text-gray-500 mt-2">
              {previousSales !== null ? (
                <>
                  {salesDifference >= 0 ? (
                    <span className="text-green-500">+{salesDifference}</span>
                  ) : (
                    <span className="text-red-500">{salesDifference}</span>
                  )}{" "}
                  compared to last month
                  {salesDifferencePercentage !== null && (
                    <>
                      {salesDifference >= 0 ? (
                        <div className="text-green-500">
                          (+{salesDifferencePercentage}%) increase
                        </div>
                      ) : (
                        <span className="text-red-500">
                          ({salesDifferencePercentage}%) decrease
                        </span>
                      )}
                    </>
                  )}
                </>
              ) : (
                <span>Previous month data unavailable</span>
              )}
            </CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
