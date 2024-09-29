import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>...</nav>
      {children}
    </div>
  );
};

export default DashboardLayout;
