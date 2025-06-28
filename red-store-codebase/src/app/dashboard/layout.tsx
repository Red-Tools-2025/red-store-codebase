"use client";
import { DashBoardProvider } from "../contexts/dashboard/DashboardContext";
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";
import { useStoreContext } from "../providers/StoreProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Loading in store detils from context provider
  const { storeData, selectedStore, isLoading } = useStoreContext();
  // loading session details
  const { session, isLoading: isLoadingSession } = useAuth();

  console.log({ session });

  return (
    <DashBoardProvider storeData={storeData} selectedStore={selectedStore}>
      <div className="min-h-screen flex flex-col items-center">
        <SessionValidator session={session} isLoading={isLoadingSession}>
          {isLoading && !storeData?.length ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Header and Filter */}
              <div className="w-full bg-white pl-3 pr-9 pt-1  ml-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  {selectedStore
                    ? `${selectedStore.storeName} Dashboard`
                    : "Individual Store Dashboard"}
                </h1>
              </div>

              {/* Dashboard Content */}
              <main className="w-full">{children}</main>
            </>
          )}
        </SessionValidator>
      </div>
    </DashBoardProvider>
  );
};

export default DashboardLayout;
