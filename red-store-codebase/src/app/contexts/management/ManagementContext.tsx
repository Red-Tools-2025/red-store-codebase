import { SessionUserType } from "@/app/types/management/context";
import { Store, Employee as PrismaEmployee } from "@prisma/client";
import { createContext, useContext } from "react";

// // Extend the existing Employee type to include role
// interface Employee extends PrismaEmployee {
//   role: Role; // Now Employee has a role field
// }

interface Role {
  roleType: string;
}

// Extend the existing Employee type to include role
interface Employee extends PrismaEmployee {
  role: Role; // Now Employee has a role field
  // Extending on store name for management table
  store: {
    storeName: string;
  };
}

interface ManagementContextType {
  storeData: Store[] | null;
  sessionData: SessionUserType | null;
  selectedStore: Store | null;
  employeeData: Employee[] | null;
  handleStoreDataRefresh: () => void;
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
  employeeData,
  handleStoreDataRefresh,
}: {
  children: React.ReactNode;
  storeData: Store[] | null;
  selectedStore: Store | null;
  sessionData: SessionUserType | null;
  employeeData: Employee[] | null;
  handleStoreDataRefresh: () => void;
}) => {
  return (
    <ManagementContext.Provider
      value={{
        selectedStore,
        storeData,
        sessionData,
        employeeData,
        handleStoreDataRefresh,
      }}
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
