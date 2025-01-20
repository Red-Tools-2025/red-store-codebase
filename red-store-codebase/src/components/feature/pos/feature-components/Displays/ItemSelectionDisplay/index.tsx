import { Inventory } from "@prisma/client";
import ItemSelectionCard from "./ItemSelectionCard";

interface ItemSelectionDisplayProps {
  isLoading: boolean;
  inventoryItems: Inventory[] | null;
}

const ItemSelectionDisplay: React.FC<ItemSelectionDisplayProps> = ({
  inventoryItems,
  isLoading,
}) => {
  return (
    <div className="flex-1 p-4 w-2/3">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {inventoryItems?.map((item) => (
            <ItemSelectionCard item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSelectionDisplay;
