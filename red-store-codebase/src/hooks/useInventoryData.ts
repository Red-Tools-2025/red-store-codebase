/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useInventoryData.ts
import axios from "axios";
import { useState, useEffect } from "react";

interface InventoryItem {
  closing_stock: number | null;
  mrp_per_bottle: number | null;
  opening_stock: number | null;
  product_id: number;
  product_name: string;
  received_stock: number | null;
  sale_amount: number | null;
  sales: number | null;
  store_id: number;
  time: string;
}

interface InventoryTimeSeriesResponse {
  data: InventoryItem[];
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
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<InventoryTimeSeriesResponse>(
          `/api/inventory/timeseries?store_id=${selectedStoreId}&startDate=${startDateState}&endDate=${endDateState}&page=${currentPage}&pageSize=${itemsPerPage}`
        );

        const data = response.data;
        setInventoryData(data.data); // Corrected: Setting only the `data` array
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setInventoryData([]); // Ensuring state reset on error
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
