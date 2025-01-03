import React, { useEffect, useState } from "react";
import { ArchiveRestore } from "lucide-react"; // Importing the ArchiveRestore icon from Lucide
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

// Define the types of the API response data
interface ApiResponse {
  current_month_total_value: number | null;
  previous_month_total_value: number | null;
  percentage_change: number | null;
  current_month_frequency: number;
  previous_month_frequency: number;
}

interface RestockInventoryCardProps {
  storeId: number | null | undefined;
}

const fetchData = async (storeId: number): Promise<ApiResponse> => {
  const response = await fetch(
    `http://localhost:3000/api/inventory/timeseries/metrics/restock-inventory?store_id=${storeId}`
  );
  const data = await response.json();
  return data.data[0]; // Assuming the data array always contains one object
};

const RestockInventoryCard: React.FC<RestockInventoryCardProps> = ({
  storeId,
}) => {
  const [restockData, setRestockData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRestockData = async () => {
      if (storeId === null || storeId === undefined) return;

      setLoading(true);
      try {
        const data = await fetchData(storeId);
        setRestockData(data);
      } catch (error) {
        console.error("Error fetching restock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestockData();
  }, [storeId]);

  // When storeId is not available, render the card with a message instead of data
  if (storeId === null || storeId === undefined) {
    return (
      <Card className="p-4 w-full sm:w-1/2 md:w-1/4 lg:w-1/4 bg-white shadow-sm rounded-lg border border-gray-300">
        <CardHeader className="flex flex-row font-inter font-semibold justify-between items-center p-0 border-b border-gray-200 pb-2">
          <div>Restock Inventory</div>
          <div>
            <ArchiveRestore className="h-6 w-6 text-gray-600" />
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="text-gray-500">Store ID is unavailable.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full   lg:w-1/4 bg-white shadow-sm rounded-lg border border-gray-300">
      <CardHeader className="flex flex-row font-inter font-semibold justify-between items-center p-0 border-b border-gray-200 pb-2">
        <div>Restock Inventory</div>
        <div>
          <ArchiveRestore className="h-6 w-6 text-gray-600" />
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        {loading ? (
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
          </div>
        ) : restockData ? (
          <div>
            <div className="text-xl lg:text-3xl font-extrabold text-gray-900">
              ₹
              {restockData.current_month_total_value?.toLocaleString() || "N/A"}
            </div>
            <CardDescription className="text-sm text-gray-500 mt-2">
              {restockData.percentage_change !== null ? (
                <>
                  {restockData.percentage_change >= 0 ? (
                    <span className="text-green-500">
                      +{restockData.percentage_change.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {restockData.percentage_change.toFixed(2)}%
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-500">
                  No data available for percentage change
                </span>
              )}
            </CardDescription>
            <div className="text-sm text-gray-500 mt-1">
              {restockData.current_month_frequency} items restocked this month
              (previous: {restockData.previous_month_frequency} items)
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestockInventoryCard;
