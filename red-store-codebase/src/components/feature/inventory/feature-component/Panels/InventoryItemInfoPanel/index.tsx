import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Inventory } from "@prisma/client";

interface InventoryItemInfoPanelProps {
  InfoPanelOpenState: boolean;
  toggleInfoPanel: () => void;
  inventoryItemDetails: Inventory;
}
const InventoryItemInfoPanel: React.FC<InventoryItemInfoPanelProps> = ({
  InfoPanelOpenState,
  inventoryItemDetails,
  toggleInfoPanel,
}) => {
  return (
    <Drawer open={InfoPanelOpenState} onOpenChange={toggleInfoPanel}>
      <DrawerContent dir="right" className="w-80">
        <DrawerHeader>
          <DrawerTitle>{inventoryItemDetails.invItem}</DrawerTitle>
          <DrawerDescription>
            {`Product details for ${inventoryItemDetails.invItem}`}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex gap-3">
            <Button variant="primary">Close</Button>
            <Button variant="secondary">Confirm Edits</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default InventoryItemInfoPanel;
