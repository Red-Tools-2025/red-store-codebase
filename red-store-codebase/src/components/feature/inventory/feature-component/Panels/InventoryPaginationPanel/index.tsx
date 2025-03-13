import { Inventory } from "@prisma/client";
import { Table } from "@tanstack/react-table";

interface InventoryPaginationPanelProps {
  table: Table<Inventory>; // ✅ Accept `table` instance instead of currentPage, setCurrentPage
}

const InventoryPaginationPanel: React.FC<InventoryPaginationPanelProps> = ({
  table,
}) => {
  const totalPages = table.getPageCount(); // ✅ Get total pages from TanStack Table
  const currentPage = table.getState().pagination.pageIndex + 1; // ✅ Get 1-based index

  return (
    <div className="flex w-full justify-between items-center py-2 px-4 border border-t-0 rounded-b-md">
      <div className="mx-auto text-sm">{`${currentPage} of ${totalPages}`}</div>

      <div className="flex gap-2">
        {/* First Page Button */}
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()} // ✅ Disables if already on first page
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            !table.getCanPreviousPage()
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          {"<<"}
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()} // ✅ Disables if no previous page
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            !table.getCanPreviousPage()
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          {"<"}
        </button>

        {/* Next Page Button */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()} // ✅ Disables if no next page
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            !table.getCanNextPage()
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          {">"}
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!table.getCanNextPage()} // ✅ Disables if already on last page
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            !table.getCanNextPage()
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default InventoryPaginationPanel;
