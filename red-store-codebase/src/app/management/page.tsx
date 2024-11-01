"use client";
import { useSession } from "next-auth/react";
import React from "react";

const ManagementPage: React.FC = () => {
  const { data: session } = useSession();
  console.log(session);
  return <main>Management page content goes here</main>;
};

export default ManagementPage;
