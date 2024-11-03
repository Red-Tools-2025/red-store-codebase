import { SessionUserType } from "@/app/types/management/context";
import { Store } from "@prisma/client";
import { createContext, useContext } from "react";

interface ManagementContextType {
  storeData: Store[] | null;
  sessionData: SessionUserType | null;
  selectedStore: Store | null;
}

const ManagementContext = createContext<ManagementContextType | undefined>(
  undefined
);

// provider wraps all components in areas we want to update and use the context value
export const ManagementProvider = ({
  children,
  storeData,
  sessionData,
  selectedStore,
}: {
  children: React.ReactNode;
  storeData: Store[] | null;
  selectedStore: Store | null;
  sessionData: SessionUserType | null;
}) => {
  return (
    <ManagementContext.Provider
      value={{ selectedStore, storeData, sessionData }}
    >
      {children}
    </ManagementContext.Provider>
  );
};

// allows me to use the context value
export const useManagement = () => {
  const context = useContext(ManagementContext);
  if (context === undefined) {
    throw new Error("useManagement must be used within a ManagementProvider");
  }
  return context;
};
