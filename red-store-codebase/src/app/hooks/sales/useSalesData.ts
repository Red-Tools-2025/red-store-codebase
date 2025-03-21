// hooks/useSalesData.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

interface SalesDataResponse {
  data: any[];
  total_pages: number;
  current_page: number;
  items_per_page: number;
  total_count: number;
}

const useSalesData = (
  currentPage: number,
  startDateState: string,
  endDateState: string,
  selectedStoreId: number,
  itemsPerPage: number
) => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [refreshInventory, setRefreshInventory] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefreshInventory(!refreshInventory);
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<SalesDataResponse>(
          "/api/inventory/timeseries",
          {
            params: {
              store_id: selectedStoreId,
              startDate: startDateState,
              endDate: endDateState,
              page: currentPage,
              pageSize: itemsPerPage,
            },
          }
        );

        setSalesData(data.data || []);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.total_count || 0);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedStoreId) {
      fetchSalesData();
    }
  }, [
    currentPage,
    startDateState,
    endDateState,
    selectedStoreId,
    itemsPerPage,
    refreshInventory,
  ]);

  return {
    salesData,
    totalPages,
    loading,
    totalCount,
    setRefreshInventory,
    refreshInventory,
    handleRefresh,
  };
};

export default useSalesData;
