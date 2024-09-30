"use client";

import { SidNavItems } from "@/components/feature/inventory/feature-components/SideNav/constants";
import { SideNavProvider } from "../contexts/inventory/SideNavContexts";

import SideNavActions from "../hooks/inventory/StaticHooks/SideNavActions";
import SideNav from "@/components/feature/inventory/feature-components/SideNav";
import useProducts from "../hooks/inventory/FetchHooks/useProducts";

const AnalyticsPage = () => {
  const { handleSideNavCloseFn } = SideNavActions();
  const { error, response } = useProducts();
  return (
    <main>
      <h2>Analytics Dashboard</h2>
      <div>{error ? <p>{error}</p> : <p>{response}</p>}</div>
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
