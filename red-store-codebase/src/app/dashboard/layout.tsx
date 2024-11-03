import React from "react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-start justify-between">
      <main className="w-full h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
