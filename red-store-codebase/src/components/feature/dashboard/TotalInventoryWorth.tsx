import React, { useEffect, useState } from "react";
import { Warehouse } from "lucide-react"; // Importing the Warehouse icon from Lucide
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import axios from "axios";

// Define the types of the API response data
interface ApiResponse {
  total_worth: number;
  previous_month_worth: number;
  increase_amount: number | null; // Handle as nullable
  increase_percentage: number | null; // Handle as nullable
}

interface TotalInventoryWorthCardProps {
  storeId: number | null | undefined;
}

const fetchData = async (storeId: number): Promise<ApiResponse | null> => {
  try {
    const response = await axios.get<{ data: ApiResponse[] }>(
      "/api/inventory/timeseries/metrics/inventory-worth",
      { params: { store_id: storeId } }
    );
    return response.data.data[0] ?? null;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return null;
  }
};

const TotalInventoryWorthCard: React.FC<TotalInventoryWorthCardProps> = ({
  storeId,
}) => {
  const [inventoryData, setInventoryData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInventory = async () => {
      if (storeId === null || storeId === undefined) return;

      setLoading(true);
      try {
        const data = await fetchData(storeId);
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [storeId]);

  // Render the card but keep the content hidden when storeId is not available
  return (
    <Card className="ml-4 p-4 w-full  lg:w-1/4 bg-white shadow-sm rounded-lg border border-gray-300">
      <CardHeader className="flex flex-row font-inter font-semibold justify-between items-center p-0 border-b border-gray-200 pb-2">
        <div>Total Inventory Worth</div>
        <div>
          <Warehouse className="h-6 w-6 text-gray-600" />
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        {storeId === null || storeId === undefined ? (
          <div className="text-gray-500">No store selected</div>
        ) : loading ? (
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
          </div>
        ) : inventoryData ? (
          <div>
            <div className="text-xl lg:text-3xl font-extrabold text-gray-900">
              ₹{inventoryData.total_worth?.toLocaleString() || "N/A"}
            </div>
            <CardDescription className="text-sm text-gray-500 mt-2">
              {inventoryData.increase_amount !== null ? (
                <span
                  className={
                    inventoryData.increase_amount >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {inventoryData.increase_amount >= 0 ? "+" : ""}
                  {inventoryData.increase_amount.toLocaleString()}
                </span>
              ) : (
                <span className="text-gray-500">No increase data</span>
              )}{" "}
              compared to last month
              <div className="mt-1">
                {inventoryData.increase_percentage !== null ? (
                  <span
                    className={
                      inventoryData.increase_percentage >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    ({inventoryData.increase_percentage >= 0 ? "+" : ""}
                    {inventoryData.increase_percentage.toFixed(2)}%)
                  </span>
                ) : (
                  <span className="text-gray-500">No percentage data</span>
                )}
              </div>
            </CardDescription>
          </div>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalInventoryWorthCard;
