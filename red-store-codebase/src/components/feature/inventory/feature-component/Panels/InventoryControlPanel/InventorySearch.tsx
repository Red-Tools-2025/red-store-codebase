import { Input } from "@/components/ui/input";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

interface InventorySearchProps {
  setSearchFilter: (value: string) => void;
  isFavoritesModalOpen: boolean;
  isAddProdModalOpen: boolean;
  globalFilter: string; // Add globalFilter to props
}

const InventroySearch: React.FC<InventorySearchProps> = ({
  setSearchFilter,
  isFavoritesModalOpen,
  isAddProdModalOpen,
  globalFilter,
}) => {
  useBarcodeScanner({
    onScan: (barcode) => {
      setSearchFilter(barcode);
    },
    enabled: !isFavoritesModalOpen && !isAddProdModalOpen, // Disable scanner when favorites modal or add product drawer is open
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  return (
    <Input
      type="text"
      placeholder="Search Product"
      value={globalFilter} // Set value to globalFilter
      onChange={handleInputChange}
      className="transition-all duration-300 ease-in-out w-80"
    />
  );
};

export default InventroySearch;
