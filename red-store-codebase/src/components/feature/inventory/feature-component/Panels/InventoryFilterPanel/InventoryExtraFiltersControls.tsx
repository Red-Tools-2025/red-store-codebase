import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";

interface InventoryExtraFiltersControlsProps {
  children: React.ReactNode;
  selectedFilters: Dispatch<SetStateAction<string[]>>;
  availableNewFilters: {
    header: string;
    accessorKey: string;
  }[];
}

const InventoryExtraFiltersControls: React.FC<
  InventoryExtraFiltersControlsProps
> = ({ children, availableNewFilters }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">More Filters</h4>
            <p className="text-sm text-muted-foreground">
              Select more filters from below to further improve your data
              control
            </p>
          </div>
          <div className="flex flex-col">
            {availableNewFilters.map((filter, index) => {
              return <p key={index}></p>;
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InventoryExtraFiltersControls;
