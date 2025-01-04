// hooks/useMeanTransactionData.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface TransactionMetrics {
  month: string;
  avg: number;
  total: number;
  highest: number;
  lowest: number;
}

const useMeanTransactionData = (storeId: number) => {
  const [chartData, setChartData] = useState<TransactionMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<{
          data:
            | {
                month: string;
                average_transaction: number;
                total_transactions: number;
                highest_transaction: number;
                lowest_transaction: number;
              }[]
            | null;
        }>("/api/inventory/timeseries/metrics/get_monthly_transaction", {
          params: { store_id: storeId },
        });

        if (data.data) {
          const formattedData = data.data.map((item) => ({
            month: item.month.trim(),
            avg: item.average_transaction,
            total: item.total_transactions,
            highest: item.highest_transaction,
            lowest: item.lowest_transaction,
          }));

          setChartData(formattedData);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Error fetching transaction metrics:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  return { chartData, loading, error };
};

export default useMeanTransactionData;
