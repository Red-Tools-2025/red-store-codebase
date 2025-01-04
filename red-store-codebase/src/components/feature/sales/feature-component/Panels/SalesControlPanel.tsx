"use client";
import { useState } from "react";
import SalesDataTable from "@/components/feature/sales/feature-component/Tables/SalesDataTable";
import { DatePickerWithRange } from "@/components/feature/sales/feature-component/DatePicker/DatePickerWithRange";
import useInventoryData from "@/app/hooks/sales/useInventoryData";
import useDateRange from "@/hooks/useDateRange";
import { useSales } from "@/app/contexts/sales/SalesContext";
import { FileTypeDialog } from "@/components/feature/sales/feature-component/FileType/FileTypeDialog";
import SalesPaginationPanel from "./SalesPaginationPanel";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const SalesControlPanel = () => {
  const { selectedStore } = useSales();
  const currentDate = new Date();
  const endDate = currentDate.toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 1);
  const defaultStartDate = startDate.toISOString().split("T")[0];

  const { startDateState, endDateState, handleDateChange } = useDateRange(
    defaultStartDate,
    endDate
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize] = useState<number>(15);

  const selectedStoreId = selectedStore?.storeId as number;
  const {
    inventoryData,
    totalPages,
    loading,
    totalCount,
    setRefreshInventory,
    refreshInventory,
  } = useInventoryData(
    currentPage,
    startDateState,
    endDateState,
    selectedStoreId,
    currentPageSize
  );

  console.log({ totalPages, totalCount });

  const handleRefresh = () => setRefreshInventory(!refreshInventory);

  return (
    <div className="flex-col w-full">
      <div className="flex gap-4 mb-4">
        <DatePickerWithRange onDateSelect={handleDateChange} />
        <Button onClick={handleRefresh} variant={"secondary"}>
          <div className="flex items-center ">
            <RefreshCw className="mr-2 h-3 w-3" />
            <p>Refresh</p>
          </div>
        </Button>
        <FileTypeDialog storeId={selectedStore?.storeId} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse delay-400"></div>
        </div>
      ) : (
        <SalesDataTable
          inventoryData={inventoryData}
          startDate={startDateState}
          endDate={endDateState}
        />
      )}

      {/* <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={
              currentPage === 1 || !inventoryData || inventoryData.length === 0
            }
            className="px-6 py-2 bg-white text-black border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            disabled={
              currentPage === totalPages ||
              !inventoryData ||
              inventoryData.length === 0
            }
            className="px-6 py-2 bg-white text-black border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Next
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <span>Page</span>
          <select
            value={currentPage}
            onChange={handlePageSelectChange}
            className="border rounded-md px-2 py-1 custom-scrollbar"
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <span>of {totalPages}</span>
        </div>
      </div> */}

      <SalesPaginationPanel
        currentPage={currentPage}
        pageSize={currentPageSize}
        setPageSize={setCurrentPage}
        setCurrentPage={setCurrentPage}
        total_count={totalCount}
        totalPages={totalPages}
      />
    </div>
  );
};

export default SalesControlPanel;
