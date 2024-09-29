"use client";
import SideNav from "@/components/feature/inventory/feature-components/SideNav";
import { SideNavItemType } from "@/components/feature/inventory/feature-components/SideNav/types";

const AnalyticsPage = () => {
  const handleSideNavCloseFn = () => {
    console.log("Closed Side Nav");
  };
  const SidNavItems: SideNavItemType[] = [
    {
      ItemHref: "/",
      ItemTitle: "Home",
    },
  ];
  return (
    <main>
      <h2>Analytics Dashboard</h2>
      <SideNav
        SideNavItems={SidNavItems}
        SideNavCloseFn={handleSideNavCloseFn}
      />
    </main>
  );
};

export default AnalyticsPage;
