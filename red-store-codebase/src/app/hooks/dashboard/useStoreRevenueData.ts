import { useState, useEffect } from "react";
import axios from "axios";

interface RevenueData {
  period: string;
  total_revenue: number;
  currency: string;
}

interface FormattedRevenueData {
  day: string;
  revenue: number;
}

interface ApiResponse {
  data: RevenueData[];
}

const useStoreRevenueData = (
  storeId: number,
  selectedYear: number | null,
  selectedMonth: number | null
) => {
  const [data, setData] = useState<FormattedRevenueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreRevenue = async () => {
      // Skip fetch if required parameters are missing
      if (!selectedYear || !selectedMonth) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: response } = await axios.get<ApiResponse>(
          "/api/inventory/timeseries/metrics/sales-revenue-all",
          {
            params: {
              store_id: storeId,
              year: selectedYear,
              month: selectedMonth,
            },
          }
        );

        // Map and format the data
        const formattedData: FormattedRevenueData[] = response.data.map(
          (item: RevenueData) => ({
            day: item.period,
            revenue: item.total_revenue,
          })
        );

        setData(formattedData);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Failed to load data");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoreRevenue();
  }, [storeId, selectedYear, selectedMonth]);

  return { data, loading, error };
};

export default useStoreRevenueData;
