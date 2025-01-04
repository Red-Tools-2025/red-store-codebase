// hooks/useInventoryData.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

interface InventoryDataResponse {
  data: any[];
  total_pages: number;
  current_page: number;
  items_per_page: number;
  total_count: number;
}

const useInventoryData = (
  currentPage: number,
  startDateState: string,
  endDateState: string,
  selectedStoreId: number,
  itemsPerPage: number
) => {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [refreshInventory, setRefreshInventory] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefreshInventory(!refreshInventory);
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<InventoryDataResponse>(
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

        setInventoryData(data.data || []);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.total_count || 0);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedStoreId) {
      fetchInventoryData();
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
    inventoryData,
    totalPages,
    loading,
    totalCount,
    setRefreshInventory,
    refreshInventory,
    handleRefresh,
  };
};

export default useInventoryData;
