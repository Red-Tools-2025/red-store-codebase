import React from "react";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
}

const ManagementPageLayout: React.FC<ManagementPageLayoutProps> = ({
  children,
}) => {
  return (
    <div>
      <h1>Management Page Header</h1>
      {children}
    </div>
  );
};

export default ManagementPageLayout;
