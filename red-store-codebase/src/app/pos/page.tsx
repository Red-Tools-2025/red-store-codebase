"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";
import { useState } from "react";

const POSPage = () => {
  const { inventoryItems, isLoading, handleRefresh } = usePos();
  const [cartItems, setCartItems] = useState<
    {
      product_id: number;
      productQuantity: number;
      productName: string;
      productBrand: string;
    }[]
  >([]);

  const handleAddToCart = (cartItem: {
    product_id: number;
    productQuantity: number;
    productName: string;
    productBrand: string;
  }) => {
    if (!cartItems.some((item) => item.product_id === cartItem.product_id)) {
      setCartItems((prev) =>
        cartItem.productQuantity === 0
          ? [...prev, { ...cartItem, productQuantity: 1 }]
          : [...prev, cartItem]
      );
    }
  };

  console.log(cartItems);

  const handleRemoveFromCart = (cartItemId: number) =>
    setCartItems((prev) =>
      prev.filter((cartItem) => cartItem.product_id != cartItemId)
    );

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="p-3">
        <ProductDisplayControl handleRefresh={handleRefresh} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable Product Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <ItemSelectionDisplay
              handleAddToCart={handleAddToCart}
              inventoryItems={inventoryItems}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Fixed Cart Section */}
        <div className="w-80 bg-green-500 p-4">
          {cartItems.map((item, i) => {
            return (
              <div key={i} className="flex flex-col">
                <p>{item.productName}</p>
                <p>{item.productQuantity}</p>
                <p onClick={() => handleRemoveFromCart(item.product_id)}>
                  remove
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default POSPage;
