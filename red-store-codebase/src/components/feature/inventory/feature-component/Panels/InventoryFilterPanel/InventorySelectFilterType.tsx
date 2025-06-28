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
  setColumnFilters,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [activeFilter, setActiveFilter] = useState<boolean>(false);

  const handleFilterChange = (value: string) => {
    setSelectedOption(value);
    setActiveFilter(true);
    // Update column filters by adding the new filter
    setColumnFilters((prev) => {
      // First remove any existing filter with this id to avoid duplicates
      const filtered = prev.filter((filter) => filter.id !== filterValue);
      // Then add the new filter
      return [...filtered, { id: filterValue, value }];
    });
  };

  const handleDeactivateFilter = () => {
    setSelectedOption(undefined);
    setActiveFilter(false);
    // Only remove this specific filter, not all filters
    setColumnFilters((prev) =>
      prev.filter((filter) => filter.id !== filterValue)
    );
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
              ? ` bg-red-100 border border-red-600 text-red-600`
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
