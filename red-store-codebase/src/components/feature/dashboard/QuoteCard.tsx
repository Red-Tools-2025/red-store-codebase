import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react"; // Icon representing analytics or inventory insights

const DashboardMessageCard: React.FC = () => {
  return (
    <Card className="w-3/5 ml-4">
      <CardHeader className="mt-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-gray-700" />
          <CardTitle className="font-inter text-lg">
            Dashboard Insights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base text-gray-600 h-28 font-inter">
          "Stay ahead of demand with real-time inventory insights. Track sales,
          monitor stock levels, and optimize restocking to ensure your shelves
          are always full and customers satisfied. Leverage detailed analytics
          to identify trends and make smarter purchasing decisions. With our
          dashboard, you'll never run out of your best-selling products, and
          you'll minimize waste from overstocking."
        </p>
      </CardContent>
      <CardFooter className="flex justify-end text-sma text-gray-500 font-inter">
        Powering smarter decisions
      </CardFooter>
    </Card>
  );
};

export default DashboardMessageCard;
