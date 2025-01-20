import { Inventory } from "@prisma/client";
import { useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";

interface ItemSelectionCardProps {
  item: Inventory;
}

const ItemSelectionCard: React.FC<ItemSelectionCardProps> = ({ item }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const handleCartCount = (sign: string) => {
    if (sign === "negative") {
      setCartCount((prev) => Math.max(prev - 1, 0));
    } else {
      setCartCount((prev) => Math.min(prev + 1, item.invItemStock));
    }
  };

  return (
    <div
      key={item.invId}
      className="bg-white border border-1 rounded-md p-3 flex flex-col h-40 justify-between transition-all group cursor-pointer"
    >
      <div className="flex text-xs gap-1">
        <p>stock</p>
        <IoIosArrowRoundForward />
        <p>{item.invItemStock}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs p-1 bg-gray-100 rounded-md border border-1 w-fit transition-all group-hover:text-black group-hover:bg-yellow-200">
          {item.invItemBrand}
        </p>
        <p className="group-hover:text-blue-600 transition-all">
          {item.invItem}
        </p>
      </div>
      <div className="flex text-sm items-end items-center justify-end gap-3">
        <CiCirclePlus
          onClick={() => handleCartCount("positive")}
          className="text-2xl hover:cursor-pointer hover:text-blue-500 transition-all"
        />
        <p className="">{cartCount}</p>
        <CiCircleMinus
          onClick={() => handleCartCount("negative")}
          className="text-2xl hover:cursor-pointer hover:text-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default ItemSelectionCard;
