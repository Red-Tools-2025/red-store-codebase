"use client";

import { SideNavProvider } from "../contexts/inventory/SideNavContexts";
// import { SidNavItems } from "@/components/feature/inventory/feature-components/SideNav/constants";

import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";
// import SideNav from "@/components/feature/inventory/feature-components/SideNav";
import { useSession } from "next-auth/react";

const AnalyticsPage = () => {
  const { handleSideNavCloseFn } = SideNavActions();
  const { data: session } = useSession();

  console.log(session);

  return (
    <div>
      {/*  <h2>Analytics Dashboard</h2> */}
      {/* <SideNavProvider>
        <SideNav
          SideNavItems={SidNavItems}
          SideNavCloseFn={handleSideNavCloseFn}
        />
      </SideNavProvider> */}
    </div>
  );
};

export default AnalyticsPage;
