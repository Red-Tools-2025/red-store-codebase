import { Button } from "@/components/ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import React from "react";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const ManagementPageLayout: React.FC<ManagementPageLayoutProps> = ({
  children,
}) => {
  return (
    <div className="p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">User and Store Management</h1>
        <div className="flex gap-2">
          <Button>Choose Outlet</Button>
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
    </div>
  );
};

export default ManagementPageLayout;
