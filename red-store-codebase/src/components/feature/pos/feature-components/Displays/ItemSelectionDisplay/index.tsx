import { Inventory } from "@prisma/client";
import ItemSelectionCard from "./ItemSelectionCard";

interface ItemSelectionDisplayProps {
  isLoading: boolean;
  inventoryItems: Inventory[] | null;
  handleAddToCart: (cartItem: {
    product_id: number;
    productPrice: number;
    productQuantity: number;
    productBrand: string;
    productName: string;
  }) => void;
}

const ItemSelectionDisplay: React.FC<ItemSelectionDisplayProps> = ({
  inventoryItems,
  isLoading,
  handleAddToCart,
}) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {inventoryItems?.map((item) => (
            <ItemSelectionCard
              handleAddToCart={handleAddToCart}
              key={item.invId}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSelectionDisplay;
