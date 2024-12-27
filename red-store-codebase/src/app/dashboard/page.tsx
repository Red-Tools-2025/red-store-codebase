"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import StoreRevenueChart from "@/components/feature/sales/Graphs/StoreRevenueChart";
import MeanTransactionChart from "@/components/feature/sales/Graphs/MeanTransactionValueChart";
import SalesFrequencyChart from "@/components/feature/sales/Graphs/SalesFrequencyChart";
import TopBottomProductList from "@/components/feature/sales/Graphs/ProductList";
import { useDashboardContext } from "../contexts/dashboard/DashboardContext"; // Adjust path as needed

const AnalyticsPage = () => {
  const { selectedStore } = useDashboardContext(); // Access selected store

  const renderChart = (
    Component: React.FC<{ storeId: number }>,
    label: string
  ) => {
    if (!selectedStore) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No data available for {label}
        </div>
      );
    }
    return <Component storeId={selectedStore.storeId} />;
  };

  return (
    <div>
      <div className="flex flex-col items-center bg-gray-50 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1800px]">
          {/* Store Revenue Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">Store Revenue</CardTitle>
              <div className="text-sm text-gray-500 font-inter mt-1">
                Sales in December-2024
              </div>
            </CardHeader>
            <CardContent>
              {renderChart(StoreRevenueChart, "Store Revenue")}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium font-inter leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground font-inter">
                Showing revenue data for the last 30 days
              </div>
            </CardFooter>
          </Card>

          {/* Mean Transaction Value Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">
                Mean Transaction Value
              </CardTitle>
              <div className="text-sm text-gray-500 font-inter mt-1">
                Transactions: December-2024
              </div>
            </CardHeader>
            <CardContent>
              {renderChart(MeanTransactionChart, "Mean Transaction Value")}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium font-inter leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground font-inter">
                Showing transaction data for each day
              </div>
            </CardFooter>
          </Card>

          {/* Sales Frequency by Time Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">
                Sale Frequency by Time
              </CardTitle>
              <div className="text-sm text-gray-500 font-inter mt-1">
                Today's Sale
              </div>
            </CardHeader>
            <CardContent>
              {renderChart(SalesFrequencyChart, "Sales Frequency")}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium font-inter leading-none">
                Trending up by 5.2% Today <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground font-inter">
                Showing sales data for each day
              </div>
            </CardFooter>
          </Card>

          {/* Product List Display */}
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">
                Top and Bottom Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStore ? (
                <TopBottomProductList storeId={selectedStore.storeId} />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No product data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
