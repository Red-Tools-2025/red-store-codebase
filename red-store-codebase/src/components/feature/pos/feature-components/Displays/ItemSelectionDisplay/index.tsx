import { Inventory } from "@prisma/client";

interface ItemSelectionDisplayProps {
  isLoading: boolean;
  inventoryItems: Inventory[] | null;
}

const ItemSelectionDisplay: React.FC<ItemSelectionDisplayProps> = ({
  inventoryItems,
  isLoading,
}) => {
  return (
    <div className="flex-1 bg-red-500 p-4 w-2/3">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {inventoryItems?.map((item, index) => {
            return <p key={index}>{item.invItem}</p>;
          })}
        </div>
      )}
    </div>
  );
};

export default ItemSelectionDisplay;
