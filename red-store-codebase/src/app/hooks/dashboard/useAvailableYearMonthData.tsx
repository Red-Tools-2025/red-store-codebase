// hooks/useAvailableYearMonthData.ts
import { useState, useEffect } from "react";

const useAvailableYearMonthData = (storeId: number) => {
  const [yearMonthData, setYearMonthData] = useState<
    { year: number; month: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearMonthData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/get-month-year?store_id=${storeId}`
        );
        const data = await response.json();

        // Assuming data is in the format: [{ year: number, month: number }]
        if (data?.data) {
          setYearMonthData(data.data);
        } else {
          setError("No year-month data available.");
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchYearMonthData();
  }, [storeId]);

  return { yearMonthData, loading, error };
};

export default useAvailableYearMonthData;
