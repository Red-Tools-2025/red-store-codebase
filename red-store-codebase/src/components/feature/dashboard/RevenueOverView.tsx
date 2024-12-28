import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiResponse {
  month: string;
  total_sales: number;
  currency: string;
}

interface SalesOverviewCardProps {
  storeId: number | null | undefined;
}

const fetchData = async (storeId: number): Promise<ApiResponse[]> => {
  const response = await fetch(
    `http://localhost:3000/api/inventory/timeseries/metrics/revenue-monthly?store_id=${storeId}`
  );
  const data = await response.json();
  return data.data;
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

      setLoading(true); // Set loading to true when fetching starts
      const data = await fetchData(storeId);
      setSalesData(data);
      setLoading(false); // Set loading to false once data is fetched

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
    return currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const salesDifference =
    previousSales !== null ? currentSales - previousSales : 0;
  const salesDifferencePercentage =
    previousSales !== null
      ? ((salesDifference / previousSales) * 100).toFixed(2)
      : null;

  return (
    <Card className="max-w-md p-4 ml-4">
      <CardHeader>
        <CardTitle className="text-lg text-black  font-inter  flex items-center justify-between">
          <div className="w-3/5 text-base">Monthly Sales Overview</div>

          <div className="w-2/5">
            <Select
              onValueChange={handleMonthChange}
              defaultValue={selectedMonth}
            >
              <SelectTrigger>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show loading animation or "Store ID is unavailable" */}
        {storeId === null || storeId === undefined ? (
          <div className="flex justify-center items-center w-full text-gray-500">
            Store ID is unavailable.
          </div>
        ) : loading ? (
          <div className="flex justify-center space-x-2 items-center w-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
          </div>
        ) : (
          <div className="flex flex-col mt-5 space-y-4">
            <div className="flex items-center justify-between ">
              <div className="text-3xl font-bold ">
                ₹{currentSales}{" "}
                <span className="text-sm text-gray-500">INR</span>
              </div>

              {/* Displaying the sales comparison */}
              {previousSales !== null ? (
                <div className="text-sm mt-2 font-inter text-right text-gray-500">
                  <div>
                    {salesDifference >= 0 ? (
                      <span className="text-green-500">+{salesDifference}</span>
                    ) : (
                      <span className="text-red-500">{salesDifference}</span>
                    )}{" "}
                    compared to last month
                  </div>
                  <div>
                    {salesDifference >= 0 ? (
                      <span className="text-green-500">
                        (+{salesDifferencePercentage}%) increase
                      </span>
                    ) : (
                      <span className="text-red-500">
                        ({salesDifferencePercentage}%) decrease
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-right font-inter text-gray-500">
                  Previous month Data Unavailable
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardDescription className="text-gray-500 font-inter mt-4 text-center">
        The total sales revenue for the selected month. Keep track of your
        monthly performance and make better business decisions.
      </CardDescription>
    </Card>
  );
};
