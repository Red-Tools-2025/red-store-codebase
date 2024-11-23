import InfoCards from "@/components/feature/inventory/info-card";
import InventoryControlPanel from "@/components/feature/management/feature-component/Tables/InventoryControlPanel";

const InventoryPage = () => {
  return (
    <main>
      <InfoCards></InfoCards>
      <InventoryControlPanel></InventoryControlPanel>
    </main>
  )
};

export default InventoryPage;
