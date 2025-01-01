import InventoryPageSizeSelector from "./InventoryPageSizeSelector";

interface InventoryPaginationPanelProps {
  currentPage: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

const InventoryPaginationPanel: React.FC<InventoryPaginationPanelProps> = ({
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  return (
    <div className="flex w-full py-2 px-4 border border-t-0 rounded-b-md">
      <InventoryPageSizeSelector />
      <div className="flex gap-2 ml-auto">
        <button className="border border-gray-300 px-2 py-1 rounded-md text-sm hover:text-blue-500 hover:border-blue-500 transition-colors">
          Previous
        </button>
        <button className="border border-gray-300 px-2 py-1 rounded-md text-sm hover:text-blue-500 hover:border-blue-500 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryPaginationPanel;
