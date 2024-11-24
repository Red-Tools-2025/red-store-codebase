"use client";
import { useState, useEffect } from "react";
import InventoryDataTable from "../Tables/InventoryDataTable";

// Please Polish UI for page

const InventoryControlPanel = () => {
  // Set default startDate and endDate
  const defaultStartDate = "2024-01-01";
  const defaultEndDate = "2024-02-20";
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [inventoryData, setInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // move it towards a hook
  const fetchInventoryData = async (page: any) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/inventory/timeseries?store_id=1&startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${itemsPerPage}`
      );
      const data = await response.json();
      setInventoryData(data.data);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  // Fetch data when component mounts and when currentPage, startDate, or endDate changes
  useEffect(() => {
    fetchInventoryData(currentPage);
  }, [currentPage, startDate, endDate]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDateChange = (type: any, value: any) => {
    if (type === "start") setStartDate(value);
    else setEndDate(value);

    // Reset pagination and fetch data for new date range
    setCurrentPage(1);
  };

  return (
    <div className="flex-col w-full">
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange("start", e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange("end", e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <InventoryDataTable
        inventoryData={inventoryData}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="text-right">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default InventoryControlPanel;
