"use client";
import { Button } from "@/components/ui/button";
import { usePos } from "../contexts/pos/PosContext";
import { RefreshCw } from "lucide-react";

const POSPage = () => {
  const { inventoryItems, isLoading, handleRefresh } = usePos();
  return (
    <div className="flex w-full h-full flex-col">
      <div className="bg-yellow-600">
        {/* Filters and Actions Panel Display */}
        <Button onClick={handleRefresh} variant={"secondary"}>
          <div className="flex items-center ">
            <RefreshCw className="mr-2 h-3 w-3" />
            <p>Refresh</p>
          </div>
        </Button>
      </div>
      {/* Item Selection Display */}
      <div className="flex w-full h-full">
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
    </div>
  );
};

export default POSPage;
