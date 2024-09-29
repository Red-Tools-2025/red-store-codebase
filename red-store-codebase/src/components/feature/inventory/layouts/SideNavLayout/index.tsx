import React from "react";

interface SideNavLayoutProps {
  sideNavTitle: string;
  children: React.ReactNode;
}

const SideNavLayout: React.FC<SideNavLayoutProps> = ({
  sideNavTitle,
  children,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold">{sideNavTitle}</h1>
      <div>{children}</div>
    </div>
  );
};

export default SideNavLayout;
