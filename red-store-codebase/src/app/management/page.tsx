"use client";
import React from "react";
import { useManagement } from "../contexts/management/ManagementContext";

const ManagementPage: React.FC = () => {
  const { sessionData, storeData } = useManagement();
  return (
    <main>
      <div className="flex my-2 gap-2">
        <div className="bg-red-300 flex w-1/2">Stores data here</div>
        <div className="bg-green-300 flex w-1/2">User data here</div>
      </div>
    </main>
  );
};

export default ManagementPage;
