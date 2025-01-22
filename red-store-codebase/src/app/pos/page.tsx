"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";

const POSPage = () => {
  const { inventoryItems, isLoading, handleRefresh } = usePos();

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
          <h2 className="font-semibold text-lg">POS Cart</h2>
          <p>Cart content here...</p>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
