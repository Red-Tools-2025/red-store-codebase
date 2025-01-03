import { useState, useEffect } from "react";

interface RevenueData {
  period: string;
  total_revenue: number;
  currency: string;
}

const useStoreRevenueData = (storeId: number, selectedYear: number | null, selectedMonth: number | null) => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreRevenue = async () => {
      if (!selectedYear || !selectedMonth) return; // Skip fetch if year or month is not selected

      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/sales-revenue-all?store_id=${storeId}&year=${selectedYear}&month=${selectedMonth}`
        );
        const result = await response.json();

        // Map and format the data
        const formattedData = result.data.map((item: { period: string; total_revenue: number }) => ({
          day: item.period,
          revenue: item.total_revenue,
        }));

        setData(formattedData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreRevenue();
  }, [storeId, selectedYear, selectedMonth]); // Dependency array includes year and month to re-fetch on change

  return { data, loading, error };
};

export default useStoreRevenueData;
