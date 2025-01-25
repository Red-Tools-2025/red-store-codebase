import { Inventory } from "@prisma/client";
import { useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { usePos } from "@/app/contexts/pos/PosContext";
import { MdDelete } from "react-icons/md";

import useCart from "@/app/hooks/pos/StaticHooks/useCart";

interface ItemSelectionCardProps {
  item: Inventory;
}

const ItemSelectionCard: React.FC<ItemSelectionCardProps> = ({ item }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const { cartItems, setCartItems } = usePos();
  const { handleAddToCart, handleRemoveFromCart } = useCart();

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
      className={`${
        cartItems.some((cart_item) => cart_item.product_id === item.invId)
          ? "bg-blue-500 text-white group"
          : "bg-white"
      } border border-1 rounded-md p-3 flex flex-col h-40 justify-between`}
    >
      <div className="flex justify-between items-center py-1">
        <div className="flex text-xs gap-1">
          <p>stock</p>
          <IoIosArrowRoundForward />
          <p>{item.invItemStock}</p>
        </div>
        {cartItems.some((cart_item) => cart_item.product_id === item.invId) ? (
          <MdDelete
            className="text-xl text-white transition-all cursor-pointer"
            onClick={() => handleRemoveFromCart(item.invId, setCartItems)}
          />
        ) : (
          <FaCartPlus
            className="text-xl hover:text-blue-500 transition-all cursor-pointer"
            onClick={() =>
              handleAddToCart(
                {
                  product_id: item.invId,
                  productQuantity: cartCount,
                  productBrand: item.invItemBrand ?? "",
                  productName: item.invItem,
                  productPrice: item.invItemPrice,
                  productCurrentStock: item.invItemStock,
                },
                cartItems,
                setCartItems
              )
            }
          />
        )}
      </div>
      <div className={`flex flex-col gap-2`}>
        <p
          className={`text-xs p-1 bg-gray-100 rounded-md border border-1 w-fit transition-all ${
            cartItems.some((cart_item) => cart_item.product_id === item.invId)
              ? "text-blue-500"
              : ""
          }`}
        >
          {item.invItemBrand}
        </p>
        <p
          className={`${
            cartItems.some((cart_item) => cart_item.product_id === item.invId)
              ? ""
              : "group-hover:text-blue-600 transition-all"
          }`}
        >
          {item.invItem}
        </p>
      </div>
      <div
        className={`flex text-sm items-end items-center justify-end gap-3 ${
          cartItems.some((cart_item) => cart_item.product_id === item.invId)
            ? "hidden"
            : ""
        }`}
      >
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
