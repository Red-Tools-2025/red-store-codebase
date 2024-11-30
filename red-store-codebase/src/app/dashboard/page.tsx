"use client";

import { SideNavProvider } from "../contexts/inventory/SideNavContexts";


import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";

import { useSession } from "next-auth/react";

const AnalyticsPage = () => {
  const { handleSideNavCloseFn } = SideNavActions();
  const { data: session } = useSession();

  console.log(session);

  return (
    <div >
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
