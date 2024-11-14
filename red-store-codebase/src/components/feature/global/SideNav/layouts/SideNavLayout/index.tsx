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
    <div className="bg-green-100 border-2 p-5 w-[300px] flex flex-col gap-5">
      <h1 className="font-bold">{sideNavTitle}</h1>
      <div>{children}</div>
    </div>
  );
};

export default SideNavLayout;
