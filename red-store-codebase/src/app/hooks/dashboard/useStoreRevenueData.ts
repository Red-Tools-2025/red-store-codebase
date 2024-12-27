"use client";

import { useState, useEffect } from "react";

interface RevenueData {
  day: string;
  revenue: number;
}

const useStoreRevenueData = (storeId: number) => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreRevenue = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/last-month?store_id=${storeId}`
        );
        const result = await response.json();
        const formattedData = result.data.map(
          (item: { bucket: string; total_revenue: number }) => ({
            day: item.bucket,
            revenue: item.total_revenue,
          })
        );
        setData(formattedData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreRevenue();
  }, [storeId]);

  return { data, loading, error };
};

export default useStoreRevenueData;
