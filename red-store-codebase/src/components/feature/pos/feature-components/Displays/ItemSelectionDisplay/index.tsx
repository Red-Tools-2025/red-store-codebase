import { Inventory } from "@prisma/client";
import { IoIosArrowRoundForward } from "react-icons/io";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

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
            <div
              key={item.invId}
              className="bg-white border border-1 rounded-md p-3 flex flex-col h-40 justify-between"
            >
              <div className="flex text-xs gap-1">
                <p>stock</p>
                <IoIosArrowRoundForward />
                <p>{item.invItemStock}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs p-1 bg-gray-100 border border-1 w-fit">
                  {item.invItemBrand}
                </p>
                <p className="">{item.invItem}</p>
              </div>
              <div className="flex text-sm items-end items-center justify-end gap-3">
                <CiCirclePlus className="text-2xl hover:cursor-pointer hover:text-blue-500 transition-all" />
                <p className="">0</p>
                <CiCircleMinus className="text-2xl hover:cursor-pointer hover:text-blue-500 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSelectionDisplay;
