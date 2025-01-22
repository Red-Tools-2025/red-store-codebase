"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";
import useCart from "../hooks/pos/StaticHooks/useCart";

const POSPage = () => {
  const { inventoryItems, isLoading, cartItems, handleRefresh, setCartItems } =
    usePos();
  const { handleRemoveFromCart } = useCart();
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
                <p
                  onClick={() =>
                    handleRemoveFromCart(item.product_id, setCartItems)
                  }
                >
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
