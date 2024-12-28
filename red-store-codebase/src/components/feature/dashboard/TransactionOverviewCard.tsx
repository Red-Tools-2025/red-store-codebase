import React, { useState, useEffect } from "react";
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
import useMeanTransactionData from "@/app/hooks/dashboard/useMeanTransactionData"; // Adjust the import path as necessary

interface TransactionOverviewCardProps {
  storeId: number | null | undefined;
}

const TransactionOverviewCard: React.FC<TransactionOverviewCardProps> = ({
  storeId,
}) => {
  const { chartData, loading, error } = useMeanTransactionData(
    storeId as number
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("December");
  const [currentTransactions, setCurrentTransactions] = useState<any | null>(
    null
  );

  useEffect(() => {
    const currentMonthData = chartData.find(
      (data) => data.month === selectedMonth
    );
    setCurrentTransactions(currentMonthData || null);
  }, [selectedMonth, chartData]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <Card className="max-w-mdborder-hidden ml-4">
      <CardHeader>
        <CardTitle className="text-lg text-gray-500 font-inter flex items-center justify-between">
     
          <div className="w-full">
            <Select 
              onValueChange={handleMonthChange}
              defaultValue={selectedMonth}
            >
              <SelectTrigger>
                <SelectValue   placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent  >
                {chartData.map((item) => (
                  <SelectItem key={item.month} value={item.month}>
                    {item.month}
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
        ) : currentTransactions ? (
          <div className="flex flex-col ">
         
            <div className="flex flex-row w-full font-inter  ">
              <div className="text-sm">
               
              
              </div>
              <div className="text-sm">
                <div>Highest Transaction: </div> $
                {currentTransactions.highest}
              </div>
              <div className="text-sm">
                <div>Lowest Transaction: </div> $
                {currentTransactions.lowest}
              </div>
              <div className="text-sm">
                <div>Total Transactions: </div>{" "}
                {currentTransactions.total}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No data available for this month
          </div>
        )}
      </CardContent>
     
    </Card>
  );
};

export default TransactionOverviewCard;
