import { useState, useEffect } from "react";

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
        const topResponse = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/top-ten?store_id=${storeId}`
        );
        const topData = await topResponse.json();
        setTopProducts(topData.data);

        const bottomResponse = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/bottom-ten?store_id=${storeId}`
        );
        const bottomData = await bottomResponse.json();
        setBottomProducts(bottomData.data);
      } catch (error) {
        setError("Error fetching products data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  return { topProducts, bottomProducts, loading, error };
};

export default useProductData;
