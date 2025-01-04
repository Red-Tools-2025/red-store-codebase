import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  product_id: number;
  total_sales: number;
}

const useProductData = (storeId: number) => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [bottomProducts, setBottomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const topResponse = await axios.get<{
          data:
            | {
                product_id: number;
                total_sales: number;
              }[]
            | null;
        }>("/api/inventory/timeseries/metrics/top-ten", {
          params: { store_id: storeId },
        });

        setTopProducts(topResponse.data.data || []);

        const bottomResponse = await axios.get<{
          data:
            | {
                product_id: number;
                total_sales: number;
              }[]
            | null;
        }>("/api/inventory/timeseries/metrics/bottom-ten", {
          params: { store_id: storeId },
        });

        setBottomProducts(bottomResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching products data:", error);
        setError("Error fetching products data");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchProducts();
    }
  }, [storeId]);

  return { topProducts, bottomProducts, loading, error };
};

export default useProductData;
