// hooks/useInventoryData.ts
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries?store_id=${selectedStoreId}&startDate=${startDateState}&endDate=${endDateState}&page=${currentPage}&pageSize=${itemsPerPage}`
        );
        const data = await response.json();

        if (!response.ok) {
          console.error(data.error || "Error fetching inventory data");
          return;
        }

        setInventoryData(data.data || []);
        setTotalPages(Math.ceil(data.total_count / itemsPerPage)); // Ensure `totalPages` updates with `pageSize`
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
  };
};

export default useInventoryData;
