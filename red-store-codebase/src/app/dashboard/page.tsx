"use client";

import { SideNavProvider } from "../contexts/inventory/SideNavContexts";
<<<<<<< HEAD


import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";

=======
// import { SidNavItems } from "@/components/feature/inventory/feature-components/SideNav/constants";

import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";
// import SideNav from "@/components/feature/inventory/feature-components/SideNav";
>>>>>>> e4f3c6cb83553de273d1df8487b1418030bca918
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
