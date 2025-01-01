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
import { Table } from "@tanstack/react-table";
import { useState } from "react";

interface InventorySelectFilterTypeProps {
  filterLabel: string;
  filterValue: string;
  filterOptions: string[];
  filterPlaceholder: string;
  table: Table<Inventory>;
}
const InventorySelectFilterType: React.FC<InventorySelectFilterTypeProps> = ({
  filterLabel,
  filterValue,
  filterOptions,
  filterPlaceholder,
  table,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [activeFilter, setActiveFilter] = useState<boolean>(false);

  const handleFilterChange = (value: string) => {
    setSelectedOption(value);
    setActiveFilter(true);
    table.getColumn(filterValue)?.setFilterValue(value);
  };

  const handleDeactivateFilter = (value: string) => {
    return table.getColumn(filterValue)?.setFilterValue(undefined);
  };

  return (
    <Select value={selectedOption} onValueChange={handleFilterChange}>
      <SelectTrigger
        className={
          `w-fit px-3 transition-all` +
          (activeFilter
            ? ` bg-blue-100 border border-blue-500 text-blue-500`
            : ``)
        }
        onClick={() => handleDeactivateFilter(filterValue)}
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
  );
};

export default InventorySelectFilterType;
