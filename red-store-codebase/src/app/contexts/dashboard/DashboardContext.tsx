import { Store } from "@prisma/client";
import { createContext, useContext } from "react";

// Define the shape of the Sales context
interface DashBoardContextType {
  storeData: Store[] | null; // Store data to associate sales with stores
  // Placeholder type for sales data, replace with your sales model
  selectedStore: Store | null; // Selected store for filtering or viewing sales
}

// Create the SalesContext with an undefined initial value
const DashBoardContext = createContext<DashBoardContextType | undefined>(undefined);

// SalesProvider component to wrap the necessary parts of your app
export const DashBoardProvider = ({
  children,
  storeData,
  
  selectedStore,
}: {
  children: React.ReactNode;
  storeData: Store[] | null;
  // Replace `any` with the actual type for your sales data
  selectedStore: Store | null;
}) => {
  return (
    <DashBoardContext.Provider value={{ storeData,  selectedStore }}>
      {children}
    </DashBoardContext.Provider>
  );
};

// Hook to access SalesContext
export const useDashboardContext = () => {
  const context = useContext(DashBoardContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
};
