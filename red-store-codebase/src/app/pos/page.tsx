"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";

const POSPage = () => {
  const { inventoryItems, isLoading, handleRefresh } = usePos();
  return (
    <div className="flex w-full h-full flex-col gap-3 mt-5">
      <div className="flex gap-3">
        {/* Filters and Actions Panel Display */}
        <ProductDisplayControl handleRefresh={handleRefresh} />
      </div>
      {/* Item Selection Display */}
      <div className="flex w-full h-full">
        <ItemSelectionDisplay
          inventoryItems={inventoryItems}
          isLoading={isLoading}
        />

        {/* POS Cart Display */}
        <div className="w-1/3 bg-green-500 p-4">
          {/* Content for cart display can go here */}
        </div>
      </div>
    </div>
  );
};

export default POSPage;
