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

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-[140px] h-9 ${className}`}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterDropdown;
