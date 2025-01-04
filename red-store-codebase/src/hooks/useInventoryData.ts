/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/inventory/timeseries?store_id=${selectedStoreId}&startDate=${startDateState}&endDate=${endDateState}&page=${currentPage}&pageSize=${itemsPerPage}`
        );
        const data = await response.json();
        setInventoryData(data.data);
        setTotalPages(data.total_pages);
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
  ]);

  return { inventoryData, totalPages, loading };
};

export default useInventoryData;
