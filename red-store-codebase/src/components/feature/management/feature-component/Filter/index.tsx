import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options?: FilterOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const FilterDropdown = ({
  label,
  options = [], // Provide default empty array
  value,
  onValueChange,
  className = "",
}: FilterDropdownProps) => {
  // Include an "All" option
  const allOption: FilterOption = { value: "All", label: "All" };
  const extendedOptions = [allOption, ...options];

  // Early return with disabled state if no options
  if (!options || options.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className={`w-[140px] h-9 ${className}`}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-options">No options available</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Determine if the filter is active
  const isActive = value && value !== "all";

  return (
    <Select
      value={value}
      onValueChange={(selectedValue) => {
        if (onValueChange) {
          onValueChange(selectedValue);
        }
      }}
    >
      <SelectTrigger
        className={`w-[140px] h-9 ${className} ${
          isActive ? "location-filter-active" : ""
        }`}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {extendedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterDropdown;
