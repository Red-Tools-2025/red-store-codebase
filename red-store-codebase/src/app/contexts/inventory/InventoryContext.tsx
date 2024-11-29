import { createContext, useContext, ReactNode } from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory, Store } from "@prisma/client";

interface InventoryContextType {
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  isLoading: boolean;
  selectedStore: Store | null;
  handleRefresh: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({
  children,
  sessionData,
  inventoryItems,
  selectedStore,
  isLoading,
  handleRefresh,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  selectedStore: Store | null;
  isLoading: boolean;
  handleRefresh: () => void;
}) => {
  return (
    <InventoryContext.Provider
      value={{
        sessionData,
        inventoryItems,
        isLoading,
        selectedStore,
        handleRefresh,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
