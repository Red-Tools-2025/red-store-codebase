import { usePos } from "@/app/contexts/pos/PosContext";
import useBrowserCacheStorage from "@/app/hooks/pos/ServerHooks/useBrowserCacheStorage";
import useCart from "@/app/hooks/pos/StaticHooks/useCart";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

const CartDisplay = () => {
  const { setCartItems, cartItems, selectedStore } = usePos();
  const { handleRemoveFromCart, handleCartItemQty } = useCart();
  const { saveToCache } = useBrowserCacheStorage();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  return (
    <div className="w-80 ml-3 p-3 pt-0 flex flex-col  ">
      <Toaster />
      <div className="flex flex-col justify-between">
        <p className="text-xl pb-3 font-semibold">Order Summary</p>
        {/* Scrollable container */}
        <div className="relative h-[450px] overflow-y-auto scrollbar-hide">
          {/* Gradient at the top */}
          <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none"></div>

          {/* Scrollable content */}
          <div className="flex flex-col gap-3">
            {cartItems.map((item, i) => (
              <div
                key={i}
                className="flex rounded-lg flex-col bg-gray-100 gap-1 p-3"
              >
                <p className="text-xs bg-white px-3 py-1 border border-1 w-fit rounded-md">
                  {item.productBrand}
                </p>
                <p className="w-30">{item.productName}</p>
                <div className="flex justify-between mt-2">
                  <p>{`x ${item.productQuantity}`}</p>
                  <div className="flex gap-1 items-center">
                    <CiCirclePlus
                      onClick={() =>
                        handleCartItemQty(
                          item.product_id,
                          "positive",
                          setCartItems
                        )
                      }
                      className="text-xl hover:cursor-pointer hover:text-blue-500 transition-all"
                    />
                    <CiCircleMinus
                      onClick={() =>
                        handleCartItemQty(
                          item.product_id,
                          "negative",
                          setCartItems
                        )
                      }
                      className="text-xl hover:cursor-pointer hover:text-blue-500 transition-all"
                    />
                    <MdOutlineDelete
                      className="text-xl text-red-300 hover:text-red-500 cursor-pointer transition-all"
                      onClick={() =>
                        handleRemoveFromCart(item.product_id, setCartItems)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient positioned above "Total" */}
        <div className="relative">
          <div className="absolute -top-6 left-0 w-full h-6 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>

          {/* Total and Checkout Button */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between p-2 bg-gray-100 rounded-md">
              <p className="font-semibold">Total :</p>
              <p>
                {`₹
                ${cartItems.reduce(
                  (total, item) =>
                    total + item.productQuantity * item.productPrice,
                  0
                )}`}
              </p>
            </div>
            <Button
              disabled={cartItems.length === 0 || isSaving}
              onClick={() =>
                saveToCache(
                  cartItems.map((cartItem) => ({
                    cartItem: {
                      product_id: cartItem.product_id,
                      product_current_stock: cartItem.productCurrentStock, // Set this to actual stock if available
                      product_name: cartItem.productName,
                      product_price: cartItem.productPrice,
                      productQuantity: cartItem.productQuantity,
                    },
                    store_id: selectedStore
                      ? selectedStore.storeId.toString()
                      : "", // Replace with the actual store ID
                    purchase_time: new Date().toISOString(),
                  })),
                  setIsSaving
                )
              }
              variant="secondary"
            >
              {isSaving ? "Saving..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;
