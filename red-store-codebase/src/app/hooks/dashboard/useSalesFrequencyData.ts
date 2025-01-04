"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface SalesFrequency {
  hour: string;
  freq: number;
}

interface UseSalesFrequencyData {
  salesFrequencyData: SalesFrequency[];
  loading: boolean;
  error: string | null;
}

const useSalesFrequencyData = (storeId: number): UseSalesFrequencyData => {
  const [salesFrequencyData, setSalesFrequencyData] = useState<
    SalesFrequency[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{
          data: { hour: number; total_sales: number }[] | null;
        }>("/api/inventory/timeseries/metrics/sales-hour", {
          params: { store_id: storeId },
        });

        const formattedData = (response.data.data || []).map((item) => ({
          hour: `${item.hour} ${item.hour < 12 ? "AM" : "PM"}`,
          freq: item.total_sales,
        }));

        setSalesFrequencyData(formattedData);
      } catch (err) {
        console.error("Error fetching sales frequency data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  return { salesFrequencyData, loading, error };
};

export default useSalesFrequencyData;
