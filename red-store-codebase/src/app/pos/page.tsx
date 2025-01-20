"use client";
import { usePos } from "../contexts/pos/PosContext";

const POSPage = () => {
  const { inventoryItems, isLoading, handleRefresh } = usePos();
  return (
    <div className="flex w-full h-full">
      {/* Item Selection Display */}
      <div className="flex-1 bg-red-500 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {inventoryItems?.map((item, index) => {
              return <p key={index}>{item.invItem}</p>;
            })}
          </div>
        )}
      </div>

      {/* POS Cart Display */}
      <div className="w-1/3 bg-green-500 p-4">
        {/* Content for cart display can go here */}
      </div>
    </div>
  );
};

export default POSPage;
