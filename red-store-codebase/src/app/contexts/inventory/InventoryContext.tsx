import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory } from "@prisma/client";

interface InventoryContextType {
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({
  children,
  sessionData,
  inventoryItems,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
}) => {
  return (
    <InventoryContext.Provider value={{ sessionData, inventoryItems }}>
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
