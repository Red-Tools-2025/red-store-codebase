/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSalesData.ts
import axios from "axios";
import { useState, useEffect } from "react";

interface SalesItem {
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
  data: SalesItem[];
  total_pages: number;
  current_page: number;
  items_per_page: number;
  total_count: number;
}

const useSalesDataOriginal = (
  currentPage: number,
  startDateState: string,
  endDateState: string,
  selectedStoreId: number,
  itemsPerPage: number
) => {
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<InventoryTimeSeriesResponse>(
          `/api/inventory/timeseries?store_id=${selectedStoreId}&startDate=${startDateState}&endDate=${endDateState}&page=${currentPage}&pageSize=${itemsPerPage}`
        );

        const data = response.data;
        setSalesData(data.data); // Corrected: Setting only the `data` array
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setSalesData([]); // Ensuring state reset on error
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
  ]);

  return { salesData, totalPages, loading };
};

export default useSalesDataOriginal;
