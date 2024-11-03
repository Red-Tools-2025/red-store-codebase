"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { SessionUserType } from "../types/management/context";
import { MdOutlineAssignment } from "react-icons/md";
import { ManagementProvider } from "../contexts/management/ManagementContext";

import React, { useState } from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";
import AddStoreModal from "@/components/feature/management/feature-component/FormModals/AddStoreModal";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;
  console.log(sessionUser?.id);

  const { data, error, isLoading } = useStoreServerFetch(sessionUser?.id ?? "");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStoreAdded = () => {
    console.log("Store Added");
  };

  return (
    <ManagementProvider storeData={data} sessionData={sessionUser ?? null}>
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
                    />
                    <Button variant={"icon-left"}>
                      <MdOutlineAssignment className="mr-2" />
                      Assign Employee
                    </Button>
                    <Button variant={"icon-left"}>
                      <IoMdPersonAdd className="mr-2" />
                      Add Employee
                    </Button>
                    <Button onClick={handleOpenModal} variant={"icon-left"}>
                      <IoStorefront className="mr-2" />
                      Add Store
                    </Button>
                    <AddStoreModal
                      isOpen={isModalOpen}
                      onClose={handleCloseModal}
                      onStoreAdded={handleStoreAdded}
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
