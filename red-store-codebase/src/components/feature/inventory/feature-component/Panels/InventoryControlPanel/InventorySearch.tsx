import { Input } from "@/components/ui/input";

interface InventorySearchProps {
  setSearchFilter: (value: string) => void;
}

const InventroySearch: React.FC<InventorySearchProps> = ({
  setSearchFilter,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  return (
    <Input
      type="text"
      placeholder="Search Product"
      onChange={handleInputChange}
      className="transition-all duration-300 ease-in-out"
    />
  );
};

export default InventroySearch;
