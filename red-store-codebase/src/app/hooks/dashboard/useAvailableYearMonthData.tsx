// hooks/useAvailableYearMonthData.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface YearMonthData {
  year: number;
  month: number;
}

const useAvailableYearMonthData = (storeId: number) => {
  const [yearMonthData, setYearMonthData] = useState<YearMonthData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearMonthData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<YearMonthData[]>(
          "/api/inventory/timeseries/metrics/get-month-year",
          {
            params: { store_id: storeId },
          }
        );

        if (data) {
          setYearMonthData(data);
        } else {
          setError("No year-month data available.");
        }
      } catch (err) {
        console.error("Error fetching year-month data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchYearMonthData();
    }
  }, [storeId]);

  return { yearMonthData, loading, error };
};

export default useAvailableYearMonthData;
