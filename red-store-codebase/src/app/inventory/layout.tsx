"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { SessionUserType } from "../types/management/context";
import { MdOutlineAssignment } from "react-icons/md";
import { ManagementProvider } from "../contexts/management/ManagementContext";

import React, { SetStateAction, useMemo, useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import AddStoreModal from "@/components/feature/management/feature-component/FormModals/AddStoreModal";
import AddEmployeeModal from "@/components/feature/management/feature-component/FormModals/AddEmployeeModal";
import { Store } from "@prisma/client";
import useEmployeeServerFetch from "../hooks/management/ServerHooks/useEmployeeServerFetch";
import AssignEmployeeModal from "@/components/feature/management/feature-component/FormModals/AssignEmployeeModal";
import useProducts from "../hooks/inventory/FetchHooks/useProducts";
import { InventoryProvider } from "../contexts/inventory/InventoryContext";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

  // Fetching store data and inventory data
  const {
    data: userStores,
    error: storeServerFetchError,
    isLoading: isLoadingStores,
  } = useStoreServerFetch(sessionUser?.id ?? "");

  // Use useEffect to set initial store when stores are loaded
  React.useEffect(() => {
    if (userStores && userStores.length > 0 && !selectedStore) {
      setIsSelectedStore(userStores[0]);
    }
  }, [userStores]);

  const {
    error: InventoryFetchError,
    inventoryItems,
    message,
    isLoading: isLoadingProducts,
  } = useProducts(
    selectedStore ? String(selectedStore.storeId) : "",
    sessionUser?.id ?? ""
  );

  const handleOpenModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(true);
  };

  const handleCloseModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(false);
  };

  // Combine loading states

  return (
    <InventoryProvider
      isLoading={isLoadingProducts}
      inventoryItems={inventoryItems}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5">
        {session ? (
          <>
            {isLoadingStores ? (
              <div>Loading...</div>
            ) : userStores && userStores.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">Inventory Overview</h1>
                  <div className="flex gap-2">
                    <DropDownStoreSelect
                      data={userStores}
                      isDisabled={userStores.length === 0}
                      setSelectedStore={setIsSelectedStore}
                      selectedStore={selectedStore}
                    />
                  </div>
                </div>
                {children}
              </>
            ) : (
              <div>No stores found</div>
            )}
          </>
        ) : (
          <main>Session not found. Please log in again.</main>
        )}
      </div>
    </InventoryProvider>
  );
};

export default Layout;
