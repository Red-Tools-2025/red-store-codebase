import { Inventory } from "@prisma/client";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { usePos } from "@/app/contexts/pos/PosContext";

import useCart from "@/app/hooks/pos/StaticHooks/useCart";

interface ItemSelectionCardProps {
  item: Inventory;
}

const ItemSelectionCard: React.FC<ItemSelectionCardProps> = ({ item }) => {
  const { cartItems, setCartItems } = usePos();
  const { handleAddToCart, handleCartItemQty } = useCart();

  const inCart = cartItems.some(
    (cart_item) => cart_item.product_id === item.invId
  );

  const isOutOfStock = item.invItemStock === 0;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) {
          handleAddToCart(
            {
              product_id: item.invId,
              productQuantity: 1,
              productBrand: item.invItemBrand ?? "",
              productName: item.invItem,
              productPrice: item.invItemPrice,
              productCurrentStock: item.invItemStock,
            },
            cartItems,
            setCartItems
          );
        }
      }}
      key={item.invId}
      className={`
        border border-1 rounded-md py-5 px-3 flex flex-col h-40 justify-between 
        transition-all ${
          isOutOfStock
            ? "bg-red-100 text-red-500 cursor-not-allowed opacity-50"
            : inCart
            ? "bg-blue-500 text-white group cursor-pointer"
            : "bg-white cursor-pointer"
        }
      `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs p-1 bg-gray-100 rounded-md border border-1 w-fit transition-all">
            #{item.invId}
          </p>
          <p className="text-xs p-1 bg-gray-100 rounded-md border border-1 w-fit transition-all">
            {item.invItemBrand}
          </p>
        </div>
        <p
          className={`${
            inCart ? "" : "group-hover:text-blue-600 transition-all"
          }`}
        >
          {item.invItem}
        </p>
        {isOutOfStock && (
          <p className="text-xs text-red-500 font-semibold">Out of Stock</p>
        )}
      </div>

      <div className="flex text-sm items-center justify-end gap-3">
        <CiCircleMinus
          onClick={() => {
            if (!isOutOfStock)
              handleCartItemQty(item.invId, "negative", setCartItems);
          }}
          className={`text-2xl hover:cursor-pointer transition-all ${
            isOutOfStock
              ? "opacity-30 cursor-not-allowed"
              : "hover:text-blue-500"
          }`}
        />
        <p>
          {cartItems.find((i) => i.product_id === item.invId)
            ?.productQuantity || 0}
        </p>
        <CiCirclePlus
          onClick={() => {
            if (!isOutOfStock)
              handleCartItemQty(item.invId, "positive", setCartItems);
          }}
          className={`text-2xl hover:cursor-pointer transition-all ${
            isOutOfStock
              ? "opacity-30 cursor-not-allowed"
              : "hover:text-blue-500"
          }`}
        />
      </div>
    </div>
  );
};

export default ItemSelectionCard;
