"use client";
import { ManagementProvider } from "../contexts/management/ManagementContext";
import useEmployeeServerFetch from "../hooks/management/ServerHooks/useEmployeeServerFetch";
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";
import { useStoreContext } from "../providers/StoreProvider";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  // Fetching session details
  const {
    handleStoreDataRefresh,
    isLoading: isLoadingStores,
    selectedStore,
    storeData: data,
  } = useStoreContext();
  const { session, isLoading: isLoadingSession } = useAuth();
  const sessionUser = session?.user;

  const { data: employeeData } = useEmployeeServerFetch(
    sessionUser?.id ?? "",
    selectedStore?.storeId ?? null
  ); // Fetch employee data

  return (
    <ManagementProvider
      handleStoreDataRefresh={handleStoreDataRefresh}
      selectedStore={selectedStore}
      storeData={data}
      sessionData={sessionUser ?? null}
      employeeData={employeeData}
    >
      <div className="p-5">
        <SessionValidator session={session} isLoading={isLoadingSession}>
          {isLoadingStores && !data?.length ? (
            <>Loading</>
          ) : (
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold">Store Management</h1>
              {children}
            </div>
          )}
        </SessionValidator>
      </div>
    </ManagementProvider>
  );
};

export default Layout;
