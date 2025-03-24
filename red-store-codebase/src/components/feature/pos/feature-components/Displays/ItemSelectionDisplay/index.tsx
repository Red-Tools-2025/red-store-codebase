import { Inventory } from "@prisma/client";
import ItemSelectionCard from "./ItemSelectionCard";
import { usePos } from "@/app/contexts/pos/PosContext";

interface ItemSelectionDisplayProps {
  isLoading: boolean;
  inventoryItems: Inventory[] | null;
}

const ItemSelectionDisplay: React.FC<ItemSelectionDisplayProps> = ({
  inventoryItems,
  isLoading,
}) => {
  const { searchTerm } = usePos();
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {inventoryItems
            ?.filter(
              (item) =>
                item.invItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.invItemBrand
                  ?.toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <ItemSelectionCard key={item.invId} item={item} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ItemSelectionDisplay;
