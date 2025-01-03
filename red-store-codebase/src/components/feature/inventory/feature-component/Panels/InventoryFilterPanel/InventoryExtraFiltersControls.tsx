import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";

interface InventoryExtraFiltersControlsProps {
  children: React.ReactNode;
  selectedFilters: string[];
  availableNewFilters: {
    header: string;
    accessorKey: string;
  }[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
}

const InventoryExtraFiltersControls: React.FC<
  InventoryExtraFiltersControlsProps
> = ({
  children,
  availableNewFilters,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleCheckboxChange = (filterHeader: string) => {
    setSelectedFilters(
      (prevSelectedFilters) =>
        prevSelectedFilters.includes(filterHeader)
          ? prevSelectedFilters.filter((header) => header !== filterHeader) // Remove filter
          : [...prevSelectedFilters, filterHeader] // Add filter
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">More Filters</h4>
            <p className="text-sm text-muted-foreground">
              Select more filters from below to further improve your data
              control.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            {availableNewFilters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  id={`filter-${filter.accessorKey}`}
                  checked={selectedFilters.includes(filter.header)}
                  onCheckedChange={() => handleCheckboxChange(filter.header)}
                />
                <Label htmlFor={`filter-${filter.accessorKey}`}>
                  {filter.header}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InventoryExtraFiltersControls;
