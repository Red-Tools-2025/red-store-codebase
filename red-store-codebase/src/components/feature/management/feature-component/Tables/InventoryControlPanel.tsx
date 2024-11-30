"use client";
import InventoryDataTable from "@/components/feature/sales/feature-component/Tables/InventoryDataTable";
import { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/components/feature/sales/feature-component/DatePicker/DatePickerWithRange"; // Import the DatePickerWithRange component

const InventoryControlPanel = () => {
  // Get the current date and calculate the start and end dates dynamically
  const currentDate = new Date();
  const endDate = currentDate.toISOString().split("T")[0]; // Current date in 'YYYY-MM-DD' format

  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 1); // Subtract one month from the current date
  const defaultStartDate = startDate.toISOString().split("T")[0]; // Start date in 'YYYY-MM-DD' format

  const [startDateState, setStartDate] = useState(defaultStartDate);
  const [endDateState, setEndDate] = useState(endDate);
  const [inventoryData, setInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // State to track loading status
  const itemsPerPage = 13;

  // Fetch inventory data based on date range and pagination
  const fetchInventoryData = async (page: any) => {
    setLoading(true); // Set loading to true when fetching
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
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  // Fetch data when component mounts and when currentPage, startDate, or endDate changes
  useEffect(() => {
    fetchInventoryData(currentPage);
  }, [currentPage, startDateState, endDateState]);

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

  const handleDateChange = (dateRange: any) => {
    if (dateRange && dateRange.from && dateRange.to) {
      setStartDate(dateRange.from.toISOString().split("T")[0]); // Convert date to string format
      setEndDate(dateRange.to.toISOString().split("T")[0]);
    }

    // Reset pagination and fetch data for new date range
    setCurrentPage(1);
  };

  return (
    <div className="flex-col w-full">
      {/* Date Picker */}
      <div className="flex gap-4 mb-4">
        <DatePickerWithRange
          className="w-full"
          onDateSelect={handleDateChange} // Handle the date selection
        />
      </div>

      {/* Loading Animation with Three Dots */}
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

      {/* Pagination */}
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
