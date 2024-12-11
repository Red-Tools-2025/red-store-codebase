import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
