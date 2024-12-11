"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProductData from "@/app/hooks/dashboard/useProductData"; // Import the custom hook

// Define types for product data
interface Product {
  product_id: number;
  total_sales: number;
}

// Define types for the hook return values
interface UseProductData {
  topProducts: Product[];
  bottomProducts: Product[];
  loading: boolean;
  error: string | null;
}

const TopBottomProductList = ({ storeId }: { storeId: number }) => {
  const [showTopProducts, setShowTopProducts] = useState<boolean>(true);

  // Use the custom hook with TypeScript
  const { topProducts, bottomProducts, loading, error }: UseProductData =
    useProductData(storeId);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-black animate-bounce"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          {showTopProducts
            ? "Top 10 Best-Selling Products"
            : "Bottom 10 Selling Products"}
          <button
            className="bg-black text-white font-inter px-2 py-1 rounded-md"
            onClick={() => setShowTopProducts(!showTopProducts)}
          >
            {showTopProducts ? "Bottom 10" : "Top 10"}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        <ul className="space-y-2">
          {(showTopProducts ? topProducts : bottomProducts).map((product) => (
            <li
              key={product.product_id}
              className="flex justify-between text-sm"
            >
              <span className="font-inter">Product {product.product_id}</span>
              <span className="font-inter">
                {product.total_sales} items sold
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopBottomProductList;
