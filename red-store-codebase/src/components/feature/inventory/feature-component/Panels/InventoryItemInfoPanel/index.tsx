import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { BsArrowRight } from "react-icons/bs";
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
  const JsonObject =
    inventoryItemDetails.invAdditional &&
    typeof inventoryItemDetails.invAdditional === "string"
      ? JSON.parse(inventoryItemDetails.invAdditional)
      : inventoryItemDetails.invAdditional || {};
  console.log(JsonObject);

  return (
    <Drawer open={InfoPanelOpenState} onOpenChange={toggleInfoPanel}>
      <DrawerContent dir="right" className="w-96 font-inter">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">
            <div className="flex gap-3 items-center">
              <p>{inventoryItemDetails.invItem}</p>
              <p className="text-lg border px-2 rounded-sm bg-green-200">
                {inventoryItemDetails.invItemStock}
              </p>
            </div>
          </DrawerTitle>
          <DrawerDescription>
            {`Product Added to inventory on ${
              inventoryItemDetails.invCreatedDate
                ? `${new Date(
                    inventoryItemDetails.invCreatedDate
                  ).getDate()}/${new Date(
                    inventoryItemDetails.invCreatedDate
                  ).getMonth()}/${new Date(
                    inventoryItemDetails.invCreatedDate
                  ).getFullYear()}`
                : "N/A"
            }`}
          </DrawerDescription>
          <div className="flex gap-2 text-sm">
            <p className="px-3 py-1 bg-blue-200 border border-1 border-blue-500 text-blue-700 rounded-sm">{`₹ ${inventoryItemDetails.invItemPrice}`}</p>
            <p className="px-3 py-1 bg-blue-200 border border-1 border-blue-500 text-blue-700 rounded-sm">{`${inventoryItemDetails.invItemBrand}`}</p>
          </div>
        </DrawerHeader>

        {/* Render JSON Fields Dynamically */}
        <div className="p-4 text-sm">
          <h3 className="font-medium text-xl mb-2">Product Information</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(JsonObject).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-2 items-center text-sm p-1 border border-1 rounded-md bg-gray-100"
              >
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <BsArrowRight />
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <div className="flex gap-3">
            <Button variant="secondary">Edit Product</Button>
            <Button variant="primary">Restock</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default InventoryItemInfoPanel;
