"use client";
import { Button } from "@/components/ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
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
import { useAuth } from "../providers/AuthProvider";
import SessionValidator from "@/components/feature/global/layouts/SessionValidator";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  // Fetching session details
  const { session, isLoading: isLoadingSession } = useAuth();
  const sessionUser = session?.user;

  const { data, isLoading: isLoadingStores } = useStoreServerFetch(
    sessionUser?.id ?? ""
  );
  const { data: employeeData } = useEmployeeServerFetch(sessionUser?.id ?? ""); // Fetch employee data

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
        <SessionValidator session={session} isLoading={isLoadingSession}>
          {isLoadingStores && !data?.length ? (
            <>Loading</>
          ) : (
            <>
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">
                  User and Store Management
                </h1>
                <div className="flex gap-2">
                  <DropDownStoreSelect
                    data={data ?? []}
                    isDisabled={data?.length === 0}
                    setSelectedStore={setIsSelectedStore}
                    selectedStore={selectedStore}
                  />
                  <Button
                    disabled={selectedStore ? false : true}
                    onClick={() => handleOpenModal(setAssignModalOpen)}
                    variant={"icon-left"}
                  >
                    <MdOutlineAssignment className="mr-2" />
                    Assign Employee
                  </Button>
                  <Button
                    disabled={selectedStore ? false : true}
                    onClick={() => handleOpenModal(setIsEmpModalOpen)}
                    variant={"icon-left"}
                  >
                    <IoMdPersonAdd className="mr-2" />
                    Add Employee
                  </Button>
                  <Button
                    onClick={() => handleOpenModal(setisStoreModalOpen)}
                    variant={"icon-left"}
                  >
                    <IoStorefront className="mr-2" />
                    Add Store
                  </Button>
                  {/* Modals */}
                  <AddStoreModal
                    isOpen={isStoreModalOpen}
                    onClose={() => handleCloseModal(setisStoreModalOpen)}
                  />
                  <AddEmployeeModal
                    isOpen={isEmpModalOpen}
                    onClose={() => handleCloseModal(setIsEmpModalOpen)}
                  />
                  <AssignEmployeeModal
                    empDataMap={empMap}
                    storeDataMap={storeMap}
                    isOpen={isAssignModalOpen}
                    onClose={() => handleCloseModal(setAssignModalOpen)}
                  />
                </div>
              </div>
              {children}
            </>
          )}
        </SessionValidator>
      </div>
    </ManagementProvider>
  );
};

export default Layout;
