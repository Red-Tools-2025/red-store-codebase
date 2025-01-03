import InfoCards from "@/components/feature/inventory/info-card";
import SalesControlPanel from "@/components/feature/sales/feature-component/Panels/SalesControlPanel";

const SalesPage = () => {
  // Correct naming convention here according to the renaming I have done for this page
  // Control panel is purely for controling the fetched inventory data and nothing more

  // Rename it and re allocate the inventory to the right folder
  // components -> features -> sales -> feature

  // maybe move Info Cards to a global component cause we will be using them quite regularly across all pages
  return (
    <main>
      <InfoCards />
      <SalesControlPanel />
    </main>
  );
};

export default SalesPage;
