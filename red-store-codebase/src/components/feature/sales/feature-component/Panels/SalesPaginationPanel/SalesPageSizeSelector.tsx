import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface InventoryPageSizeSelectorProps {
  total_count: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setSelectedPageSize: Dispatch<SetStateAction<number>>;
}

const InventoryPageSizeSelector: React.FC<InventoryPageSizeSelectorProps> = ({
  pageSize,
  total_count,
  setCurrentPage,
  setSelectedPageSize,
}) => {
  const pageSizeOptions = [5, 10, 15, 20, 50, 100];

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">Show</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-sm">
            {pageSize}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {pageSizeOptions.map((size) => (
            <DropdownMenuItem
              disabled={size > total_count}
              key={size}
              onClick={() => {
                setCurrentPage(1); // Reset to the first page
                setSelectedPageSize(size); // Update the page size
              }}
            >
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-sm text-gray-500">entries</p>
    </div>
  );
};

export default InventoryPageSizeSelector;
