"use client";
import { useManagement } from "../contexts/management/ManagementContext";
import React, { useState } from "react";
import StoreDataTable from "@/components/feature/management/feature-component/Tables/StoreDataTable";
import StoreTableController from "@/components/feature/management/feature-component/Tables/StoreTableController";
import StoreControlPanel from "@/components/feature/management/feature-component/Panels/StoreControlPanel";

const ManagementPage: React.FC = () => {
  const { sessionData, storeData } = useManagement();

  return (
    <main>
      <div className="flex my-2 gap-2">
        {/* Control panel for store data */}
        <StoreControlPanel storeData={storeData} />
        <div className="bg-green-300 flex w-1/2 p-4 flex-col">
          <h1 className="text-lg font-semibold mb-2">User Data</h1>
          {/* Render user-related data here */}
          {sessionData ? (
            <div>{/* Render session data here */}</div>
          ) : (
            <p className="text-center text-gray-700">No user data available</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagementPage;
