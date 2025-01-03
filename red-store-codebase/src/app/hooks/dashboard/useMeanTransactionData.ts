// hooks/useMeanTransactionData.ts
import { useState, useEffect } from "react";

const useMeanTransactionData = (storeId: number) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries/metrics/get_monthly_transaction?store_id=${storeId}`
        );
        const data = await response.json();
        const formattedData = data.data.map(
          (item: {
            month: string;
            average_transaction: number;
            total_transactions: number;
            highest_transaction: number;
            lowest_transaction: number;
          }) => ({
            month: item.month.trim(),
            avg: item.average_transaction,
            total: item.total_transactions,
            highest: item.highest_transaction,
            lowest: item.lowest_transaction,
          })
        );
        setChartData(formattedData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  return { chartData, loading, error };
};

export default useMeanTransactionData;
