import React from "react";
import Sidebar from "@/components/feature/inventory/feature-components/SideNav/Sidebar";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-start justify-between">
      {/* <h1>Dashboard</h1>
      <nav>...</nav> */}
      <Sidebar></Sidebar>
      <main className="w-full h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
