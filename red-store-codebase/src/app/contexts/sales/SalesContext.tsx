import { createContext, useContext, ReactNode } from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Store } from "@prisma/client";

interface SalesContextType {
  sessionData: SessionUserType | null;
  selectedStore: Store | null;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({
  children,
  sessionData,

  selectedStore,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  selectedStore: Store | null;
}) => {
  return (
    <SalesContext.Provider
      value={{
        sessionData,
        selectedStore,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
