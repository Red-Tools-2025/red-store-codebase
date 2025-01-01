import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventorySelectFilterTypeProps {
  filterLabel: string;
  filterPlaceholder: string;
  filterOptions: string[];
}
const InventorySelectFilterType: React.FC<InventorySelectFilterTypeProps> = ({
  filterLabel,
  filterOptions,
  filterPlaceholder,
}) => {
  return (
    <Select>
      <SelectTrigger className="w-fit px-3">
        <SelectValue placeholder="Filter by brand" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Stock Brands</SelectLabel>
          {filterOptions.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default InventorySelectFilterType;
