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

  return (
    <div
      onClick={() =>
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
        )
      }
      key={item.invId}
      className={`${
        cartItems.some((cart_item) => cart_item.product_id === item.invId)
          ? "bg-blue-500 text-white group"
          : "bg-white"
      } border border-1 rounded-md py-5 px-3 flex flex-col h-40 justify-between`}
    >
      {/* <div className="flex justify-between items-center py-1">
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
      </div> */}
      <div className={`flex flex-col gap-2`}>
        <p
          className={`text-xs p-1 bg-gray-100 rounded-md border border-1 w-fit transition-all ${
            inCart ? "text-blue-500" : ""
          }`}
        >
          {item.invItemBrand}
        </p>
        <p
          className={`${
            inCart ? "" : "group-hover:text-blue-600 transition-all"
          }`}
        >
          {item.invItem}
        </p>
      </div>
      <div
        className={`flex text-sm items-end items-center justify-end gap-3 ${
          inCart ? "text-white" : ""
        }`}
      >
        <CiCircleMinus
          onClick={() =>
            handleCartItemQty(item.invId, "negative", setCartItems)
          }
          className={`text-2xl hover:cursor-pointer ${
            inCart ? "" : " hover:text-blue-500"
          }transition-all`}
        />
        <p className="">
          {cartItems.find((i) => i.product_id === item.invId)
            ?.productQuantity || 0}
        </p>
        <CiCirclePlus
          onClick={() =>
            handleCartItemQty(item.invId, "positive", setCartItems)
          }
          className={`text-2xl hover:cursor-pointer ${
            inCart ? "" : "hover:text-blue-500"
          }transition-all`}
        />
      </div>
    </div>
  );
};

export default ItemSelectionCard;
