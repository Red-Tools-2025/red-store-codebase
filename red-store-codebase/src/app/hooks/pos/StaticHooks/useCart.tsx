import { Cart } from "@/app/types/pos/cart";
import { Dispatch, SetStateAction } from "react";

const useCart = () => {
  const handleAddToCart = (
    cartItem: Cart,
    cartItems: Cart[],
    setCartItems: Dispatch<SetStateAction<Cart[]>>
  ) => {
    if (!cartItems.some((item) => item.product_id === cartItem.product_id)) {
      setCartItems((prev) =>
        cartItem.productQuantity === 0
          ? [...prev, { ...cartItem, productQuantity: 1 }]
          : [...prev, cartItem]
      );
    }
  };

  const handleRemoveFromCart = (
    cartItemId: number,
    setCartItems: Dispatch<SetStateAction<Cart[]>>
  ) =>
    setCartItems((prev) =>
      prev.filter((cartItem) => cartItem.product_id != cartItemId)
    );

  return { handleAddToCart, handleRemoveFromCart };
};

export default useCart;
