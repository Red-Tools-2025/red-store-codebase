
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import StoreRevenueChart from "@/components/feature/sales/Graphs/StoreRevenueChart"; // Import the StoreRevenueChart component
import MeanTransactionChart from "@/components/feature/sales/Graphs/MeanTransactionValueChart";
import SalesFrequencyChart from "@/components/feature/sales/Graphs/SalesFrequencyChart";
import TopBottomProductList from "@/components/feature/sales/Graphs/ProductList";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
  avg: {
    label: "Average",
    color: "#000000",
  },
  freq: {
    label: "Item Sold",
    color: "#000000",
  },
};

const AnalyticsPage = () => {


  return (
    <div>
      <h1 className="text-2xl font-bold ml-9 ">Individual Store Dashboard</h1>
      <div className="flex flex-col items-center bg-gray-50 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1800px]">
          {/* Store Revenue Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-inter">Store Revenue</CardTitle>
              <div className="text-sm text-gray-500 font-inter mt-1 ">
                Sales in December-2024
              </div>
            </CardHeader>
            <CardContent>
              <StoreRevenueChart storeId={6} />
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
              <div className="text-sm text-gray-500 font-inter mt-1 ">
                Transactions: December-2024
              </div>
            </CardHeader>
            <CardContent>
              <MeanTransactionChart storeId={6} />
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
              <div className="text-sm text-gray-500 font-inter mt-1 ">
                Today's Sale
              </div>
            </CardHeader>
            <CardContent>
              <SalesFrequencyChart storeId={6} />
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
   
          <TopBottomProductList storeId={6} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
