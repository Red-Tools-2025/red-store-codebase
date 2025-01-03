"use client";

import { TrendingUp } from "lucide-react";
import StoreRevenueChart from "@/components/feature/sales/Graphs/StoreRevenueChart";
import MeanTransactionChart from "@/components/feature/sales/Graphs/MeanTransactionValueChart";
import SalesFrequencyChart from "@/components/feature/sales/Graphs/SalesFrequencyChart";
import TopBottomProductList from "@/components/feature/sales/Graphs/ProductList";
import { useDashboardContext } from "../contexts/dashboard/DashboardContext"; // Adjust path as needed
import CardFirst from "@/components/feature/dashboard/Card";

import TopProductsTable from "@/components/feature/dashboard/CardContent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesOverviewCard } from "@/components/feature/dashboard/RevenueOverView";
import TransactionOverviewCard from "@/components/feature/dashboard/TransactionOverviewCard";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import TotalInventoryWorthCard from "@/components/feature/dashboard/TotalInventoryWorth";
import RestockInventoryCard from "@/components/feature/dashboard/Restock-Inventory";

const AnalyticsPage = () => {
  const { selectedStore } = useDashboardContext(); // Access selected store
  const [showSalesRevenue, setShowSalesRevenue] = useState(true); // State to toggle cards

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
      <div className="flex flex-wrap  justify-start gap-4 lg:gap-10">
        <TotalInventoryWorthCard storeId={selectedStore?.storeId} />
        <SalesOverviewCard storeId={selectedStore?.storeId} />
        <RestockInventoryCard storeId={selectedStore?.storeId} />
      </div>
      <div className="flex flex-col items-center bg-gray-50 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Sales Revenue Card */}
          {showSalesRevenue && (
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-inter">Store Revenue</CardTitle>
                  <Switch
                    id="toggle-sales-revenue"
                    checked={showSalesRevenue}
                    onCheckedChange={(checked) => setShowSalesRevenue(checked)}
                    aria-label="Toggle Sales Revenue View"
                  />
                </div>
                <div className="text-sm text-gray-500 font-inter mt-1">
                  Sales in a particular year and month
                </div>
              </CardHeader>
              <CardContent>
                {renderChart(StoreRevenueChart, "Store Revenue")}
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium font-inter leading-none">
                  Trending up by 5.2% this month
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground font-inter">
                  Showing revenue data for the last 30 days
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Sales Frequency Card */}
          {!showSalesRevenue && (
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-inter">
                    Sale Frequency by Time
                  </CardTitle>
                  <Switch
                    id="toggle-sales-revenue"
                    checked={showSalesRevenue}
                    onCheckedChange={(checked) => setShowSalesRevenue(checked)}
                    aria-label="Toggle Sales Revenue View"
                  />
                </div>
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
          )}

          {/* Mean Transaction Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="font-inter">
                Mean Transaction Value
              </CardTitle>
              <div className="text-sm text-gray-500 font-inter mt-1">
                View the transaction details for the selected month and make
                informed business decisions.
              </div>
            </CardHeader>
            <CardContent className="flex flex-col">
              {renderChart(MeanTransactionChart, "Mean Transaction Value")}
              <div className="w-full">
                <TransactionOverviewCard storeId={selectedStore?.storeId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TopProductsTable storeId={selectedStore?.storeId} />
    </div>
  );
};

export default AnalyticsPage;
