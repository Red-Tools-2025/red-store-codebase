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

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;
  console.log(sessionUser?.id);

  const { data, error, isLoading } = useStoreServerFetch(sessionUser?.id ?? "");
  const {
    data: employeeData,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useEmployeeServerFetch(sessionUser?.id ?? ""); // Fetch employee data

  const [isStoreModalOpen, setisStoreModalOpen] = useState<boolean>(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  const [selectedStore, setIsSelectedStore] = useState<Store | null>(null);

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

  // Creating Map for O(1) look up, to be done for all cases handling dynamic data as select options
  // Maps to be used in future modals, but now the assign modal

  const empMap = useMemo(() => {
    if (!employeeData) return null;
    return new Map(
      employeeData
        .filter((emp) => emp.storeId === selectedStore?.storeId)
        .map((emp) => [emp.empId.toString(), emp])
    );
  }, [employeeData, selectedStore]);

  const storeMap = useMemo(() => {
    if (!data) return null;
    return new Map(
      data
        .filter((store) => store.storeId != selectedStore?.storeId)
        .map((store) => [store.storeId.toString(), store])
    );
  }, [data, selectedStore]);

  return (
    <ManagementProvider
      selectedStore={selectedStore}
      storeData={data}
      sessionData={sessionUser ?? null}
      employeeData={employeeData}
    >
      <div className="p-5">
        {session ? (
          <>
            {isLoading && !data?.length ? (
              <>Loading</>
            ) : (
              <>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">Inventory Overview</h1>
                  <div className="flex gap-2">
                    <DropDownStoreSelect
                      data={data ?? []}
                      isDisabled={data?.length === 0}
                      setSelectedStore={setIsSelectedStore}
                      selectedStore={selectedStore}
                    />
                  </div>
                </div>
                {children}
              </>
            )}
          </>
        ) : (
          <main>Session not found please login again</main>
        )}
      </div>
    </ManagementProvider>
  );
};

export default Layout;
