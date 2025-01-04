import InventoryPageSizeSelector from "./InventoryPageSizeSelector";

interface InventoryPaginationPanelProps {
  currentPage: number;
  pageSize: number;
  total_count: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

const InventoryPaginationPanel: React.FC<InventoryPaginationPanelProps> = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  total_count,
}) => {
  const totalPages = Math.ceil(total_count / pageSize); // Total pages rounded up

  const handleNavigation = (direction: "next" | "previous") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex w-full justify-between items-center py-2 px-4 border border-t-0 rounded-b-md">
      <InventoryPageSizeSelector
        total_count={total_count}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setSelectedPageSize={setPageSize}
      />
      <div className="mx-auto text-sm">{`${currentPage} of ${totalPages}`}</div>
      <div className="flex gap-2">
        <button
          onClick={() => handleNavigation("previous")}
          disabled={currentPage === 1}
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            currentPage === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handleNavigation("next")}
          disabled={currentPage === totalPages}
          className={`border px-2 py-1 rounded-md text-sm transition-colors ${
            currentPage === totalPages
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-300 hover:text-blue-500 hover:border-blue-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryPaginationPanel;
