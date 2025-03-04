"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";
import CartDisplay from "@/components/feature/pos/feature-components/Displays/CartDisplay";

const POSPage = () => {
  const { inventoryItems, isLoading } = usePos();
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="py-3">
        <ProductDisplayControl />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable Product Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2 pr-2">
            <ItemSelectionDisplay
              inventoryItems={inventoryItems}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Fixed Cart Section */}
        <CartDisplay />
      </div>
    </div>
  );
};

export default POSPage;
