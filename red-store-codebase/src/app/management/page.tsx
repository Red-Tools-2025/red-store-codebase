"use client";
import { useManagement } from "../contexts/management/ManagementContext";
import React from "react";
import StoreControlPanel from "@/components/feature/management/feature-component/Panels/StoreControlPanel";
import EmployeeControlPanel from "@/components/feature/management/feature-component/Panels/EmployeeConrolPanel";

const ManagementPage: React.FC = () => {
  const { sessionData, storeData } = useManagement();
  return (
    <main>
      <div className="flex my-2 gap-2">
        {/* Control panel for store data */}
        <StoreControlPanel storeData={storeData} />
        {/* Control panel for employee data */}
        <EmployeeControlPanel />
      </div>
    </main>
  );
};

export default ManagementPage;
