"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { SessionUserType } from "../types/management/context";
import { MdOutlineAssignment } from "react-icons/md";
import { ManagementProvider } from "../contexts/management/ManagementContext";

import React, { SetStateAction, useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import AddStoreModal from "@/components/feature/management/feature-component/FormModals/AddStoreModal";
import AddEmployeeModal from "@/components/feature/management/feature-component/FormModals/AddEmployeeModal";
import { Store } from "@prisma/client";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;
  console.log(sessionUser?.id);

  const { data, error, isLoading } = useStoreServerFetch(sessionUser?.id ?? "");

  const [isStoreModalOpen, setisStoreModalOpen] = useState<boolean>(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState<boolean>(false);

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

  return (
    <ManagementProvider
      selectedStore={selectedStore}
      storeData={data}
      sessionData={sessionUser ?? null}
    >
      <div className="p-5">
        {session ? (
          <>
            {isLoading && !data?.length ? (
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
                    <Button variant={"icon-left"}>
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
                    <AddStoreModal
                      isOpen={isStoreModalOpen}
                      onClose={() => handleCloseModal(setisStoreModalOpen)}
                    />
                    <AddEmployeeModal
                      isOpen={isEmpModalOpen}
                      onClose={() => handleCloseModal(setIsEmpModalOpen)}
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
