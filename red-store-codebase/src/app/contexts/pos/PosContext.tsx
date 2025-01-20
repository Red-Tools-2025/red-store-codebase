import { createContext, useContext, ReactNode } from "react";
import { SessionUserType } from "@/app/types/management/context";
import { Inventory } from "@prisma/client";

interface PosContextType {
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  isLoading: boolean;
  handleRefresh: () => void;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider = ({
  children,
  sessionData,
  inventoryItems,
  isLoading,
  handleRefresh,
}: {
  children: ReactNode;
  sessionData: SessionUserType | null;
  inventoryItems: Inventory[] | null;
  isLoading: boolean;
  handleRefresh: () => void;
}) => {
  return (
    <PosContext.Provider
      value={{
        sessionData,
        inventoryItems,
        isLoading,
        handleRefresh,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (context === undefined) {
    throw new Error("usePos must be used within a PosProvider");
  }
  return context;
};
