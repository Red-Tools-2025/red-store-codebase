"use client";
import { useSession } from "next-auth/react";
import React from "react";

const ManagementPage: React.FC = () => {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <main>Management page content goes here</main>
      ) : (
        <main>Session expired please login again</main>
      )}
    </>
  );
};

export default ManagementPage;
