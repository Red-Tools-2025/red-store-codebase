"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { SessionUserType } from "../types/management/context";
import { MdOutlineAssignment } from "react-icons/md";
import { ManagementProvider } from "../contexts/management/ManagementContext";

import React from "react";
import DropDownStoreSelect from "@/components/feature/management/feature-component/DropDownStoreSelect";
import useStoreServerFetch from "../hooks/management/ServerHooks/useStoreServerFetch";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ManagementPageLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user as SessionUserType | undefined;
  console.log(sessionUser?.id);

  const { data, error, isLoading } = useStoreServerFetch(sessionUser?.id ?? "");

  return (
    <ManagementProvider storeData={data} sessionData={sessionUser ?? null}>
      <div className="p-5">
        {session ? (
          <div>
            {isLoading && !data?.length ? (
              <>Loading</>
            ) : (
              <>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">
                    User and Store Management
                  </h1>
                  <div className="flex gap-2">
                    <DropDownStoreSelect isDisabled={data?.length === 0} />
                    <Button variant={"icon-left"}>
                      <MdOutlineAssignment className="mr-2" />
                      Assign Employee
                    </Button>
                    <Button variant={"icon-left"}>
                      <IoMdPersonAdd className="mr-2" />
                      Add Employee
                    </Button>
                    <Button variant={"icon-left"}>
                      <IoStorefront className="mr-2" />
                      Add Store
                    </Button>
                  </div>
                </div>
                {children}
              </>
            )}
          </div>
        ) : (
          <main>Session not found please login again</main>
        )}
      </div>
    </ManagementProvider>
  );
};

export default Layout;
