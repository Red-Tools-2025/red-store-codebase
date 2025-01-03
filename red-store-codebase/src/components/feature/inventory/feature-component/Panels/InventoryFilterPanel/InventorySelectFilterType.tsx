import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Inventory } from "@prisma/client";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

interface InventorySelectFilterTypeProps {
  filterLabel: string;
  filterValue: string;
  filterOptions: string[];
  filterPlaceholder: string;
  table: Table<Inventory>;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const InventorySelectFilterType: React.FC<InventorySelectFilterTypeProps> = ({
  filterLabel,
  filterValue,
  filterOptions,
  filterPlaceholder,
  table,
  setColumnFilters,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [activeFilter, setActiveFilter] = useState<boolean>(false);

  const handleFilterChange = (value: string) => {
    setSelectedOption(value);
    setActiveFilter(true);
    // table.getColumn(filterValue)?.setFilterValue(value);
    setColumnFilters((prev) => [
      ...prev,
      ...[
        { id: filterValue, value }, // Assuming `invItem` is the column ID for product names
      ],
    ]);
  };

  const handleDeactivateFilter = () => {
    setSelectedOption(undefined);
    setActiveFilter(false);
    // table.getColumn(filterValue)?.setFilterValue(undefined);
    setColumnFilters([]);
  };

  // Sync state when table updates externally
  return (
    <div className="flex items-center gap-1">
      <Select
        value={selectedOption || ""} // Explicitly set value to an empty string if no option is selected
        onValueChange={handleFilterChange}
      >
        <SelectTrigger
          className={
            `w-fit px-3 transition-all text-gray-500 hover:text-gray-800` +
            (activeFilter
              ? ` bg-blue-100 border border-blue-500 text-blue-500`
              : ``)
          }
        >
          <SelectValue placeholder={filterPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{filterLabel}</SelectLabel>
            {filterOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {activeFilter && (
        <IoIosClose
          size={20}
          className="cursor-pointer hover:text-red-500"
          onClick={handleDeactivateFilter}
        />
      )}
    </div>
  );
};

export default InventorySelectFilterType;
