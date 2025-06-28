"use client";
import { SessionUserType } from "../types/management/context";

import { SalesProvider } from "../contexts/sales/SalesContext";
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";
import { useStoreContext } from "../providers/StoreProvider";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  // Loading in store detils from context provider
  const {
    storeData,
    selectedStore,
    isLoading: isLoadingStores,
  } = useStoreContext();
  // Fetch session data
  const { session, isLoading: isLoadingSession } = useAuth();

  const sessionUser = session?.user as SessionUserType | undefined;

  return (
    <SalesProvider
      selectedStore={selectedStore}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5 font-inter">
        <SessionValidator session={session} isLoading={isLoadingSession}>
          {isLoadingStores ? (
            <div>Loading...</div>
          ) : storeData && storeData.length > 0 ? (
            <>
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Sales Overview</h1>
              </div>
              {children}
            </>
          ) : (
            <div>No stores found</div>
          )}
        </SessionValidator>
      </div>
    </SalesProvider>
  );
};

export default Layout;
