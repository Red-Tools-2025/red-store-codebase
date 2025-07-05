"use client";
import { useManagement } from "../contexts/management/ManagementContext";
import React from "react";
import EmployeeControlPanel from "@/components/feature/management/feature-component/Panels/EmployeeConrolPanel";
import { Toaster } from "@/components/ui/toaster";

const ManagementPage: React.FC = () => {
  const { employeeData } = useManagement();

  return (
    <main>
      <div className="">
        {/* Control panel for store data */}
        {/* <StoreControlPanel storeData={storeData} /> */}
        {/* Control panel for employee data */}
        <EmployeeControlPanel employeeData={employeeData} />
        <Toaster /> {/* Call for toast to be displayed */}
      </div>
    </main>
  );
};

export default ManagementPage;
