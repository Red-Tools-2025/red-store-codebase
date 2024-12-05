"use client";
import InventoryDataTable from "@/components/feature/sales/feature-component/Tables/InventoryDataTable";
import { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/components/feature/sales/feature-component/DatePicker/DatePickerWithRange";
import "../../../../../styles/global.css"
const InventoryControlPanel = () => {
  const currentDate = new Date();
  const endDate = currentDate.toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 1);
  const defaultStartDate = startDate.toISOString().split("T")[0];

  const [startDateState, setStartDate] = useState(defaultStartDate);
  const [endDateState, setEndDate] = useState(endDate);
  const [inventoryData, setInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 13;

  const fetchInventoryData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/inventory/timeseries?store_id=7&startDate=${startDateState}&endDate=${endDateState}&page=${page}&pageSize=${itemsPerPage}`
      );
      const data = await response.json();
      setInventoryData(data.data);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData(currentPage);
  }, [currentPage, startDateState, endDateState]);

  const handleDateChange = (dateRange: any) => {
    if (dateRange && dateRange.from && dateRange.to) {
      setStartDate(dateRange.from.toISOString().split("T")[0]);
      setEndDate(dateRange.to.toISOString().split("T")[0]);
    }
    setCurrentPage(1);
  };

  const handlePageSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = Number(event.target.value);
    setCurrentPage(selectedPage);
  };

  return (
    <div className="flex-col w-full">
      <div className="flex gap-4 mb-4">
        <DatePickerWithRange
          className="w-full"
          onDateSelect={handleDateChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse delay-400"></div>
        </div>
      ) : (
        <InventoryDataTable
          inventoryData={inventoryData}
          startDate={startDateState}
          endDate={endDateState}
        />
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-white text-black border border-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            disabled={currentPage === totalPages}
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
      </div>
    </div>
  );
};

export default InventoryControlPanel;
