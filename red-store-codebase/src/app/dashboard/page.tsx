"use client";

import { SidNavItems } from "@/components/feature/inventory/feature-components/SideNav/constants";
import { SideNavProvider } from "../contexts/inventory/SideNavContexts";

import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";
import SideNav from "@/components/feature/inventory/feature-components/SideNav";

const AnalyticsPage = () => {
  const { handleSideNavCloseFn } = SideNavActions();
  return (
    <main>
      <h2>Analytics Dashboard</h2>
      <SideNavProvider>
        <SideNav
          SideNavItems={SidNavItems}
          SideNavCloseFn={handleSideNavCloseFn}
        />
      </SideNavProvider>
    </main>
  );
};

export default AnalyticsPage;
