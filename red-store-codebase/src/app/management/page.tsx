"use client";
import React from "react";
import { useManagement } from "../contexts/management/ManagementContext";

const ManagementPage: React.FC = () => {
  const { sessionData } = useManagement();
  return <main>Management page content goes here</main>;
};

export default ManagementPage;
