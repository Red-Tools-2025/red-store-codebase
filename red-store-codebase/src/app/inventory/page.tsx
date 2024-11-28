"use client";
import { InfoCard } from "@/components/feature/management/info-card";
import { Input } from "@/components/ui/input";
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { Badge, IndianRupee } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { SessionUserType } from "../types/management/context";
import { useInventory } from "../contexts/inventory/InventoryContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InventoryPage = () => {
  const { data: session } = useSession();
  const { inventoryItems, isLoading: isLoadingProducts } = useInventory();
  const [displayState, setDisplayState] = useState<string>("list");
  const sessionUser = session?.user as SessionUserType | undefined;

  return (
    <div>
      {/* Control Panel */}
      <div className="my-5 flex items-center justify-between">
        <div className="flex w-2/4 items-center space-x-4">
          <Input
            type="text"
            placeholder="Search Product"
            className="transition-all duration-300 ease-in-out"
          />
          <div className="flex space-x-1">
            {/* Grid Icon */}
            <div
              className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
              ${
                displayState === "grid"
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-300 border-gray-500 opacity-50"
              } transition-all duration-300 ease-in-out`}
              onClick={() => setDisplayState("grid")}
            >
              <IoGrid
                className={`text-md ${
                  displayState === "grid" ? "text-green-500" : "text-gray-500"
                } transition-all duration-300 ease-in-out`}
              />
            </div>
            {/* List Icon */}
            <div
              className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
              ${
                displayState === "list"
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-300 border-gray-500 opacity-50"
              }`}
              onClick={() => setDisplayState("list")}
            >
              <FaListUl
                className={`text-md ${
                  displayState === "list" ? "text-green-500" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Other Options */}
        <div className="flex space-x-2">
          <Button variant={"secondary"}>
            <SlOptionsVertical />
          </Button>
          <Button variant={"secondary"}>Add Product</Button>
        </div>
      </div>
      {/* Inventory Render boi*/}
      <div>
        {isLoadingProducts ? (
          <div>Fetching Products</div>
        ) : (
          <div>
            {!inventoryItems ? (
              <div>Issue in Rendering Inventory Items</div>
            ) : inventoryItems.length === 0 ? (
              <div className="Let's begin adding products to your inventory"></div>
            ) : (
              // <div className="flex-col space-y-2">
              //   {inventoryItems.map((item, index) => {
              //     return (
              //       <div
              //         className="bg-gray-100 px-3 py-2 rounded-sm flex-col space-y-1"
              //         key={index}
              //       >
              //         <div className="flex items-center space-x-2">
              //           <p className="font-bold text-lg">{item.invItem}</p>
              //           <p className="px-1 rounded-sm bg-white">
              //             #{item.invitemid}
              //           </p>
              //         </div>
              //         <div className="flex items-center space-x-2">
              //           <p className="">{item.invItemBrand}</p>
              //           <p className="py-0.2 px-1 rounded-sm text-green-600 bg-green-200">
              //             {item.invItemType}
              //           </p>
              //         </div>
              //       </div>
              //     );
              //   })}
              // </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Sale</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-lg">{item.invItem}</p>
                          <Badge className="text-green-600 bg-green-200">
                            #{item.invitemid}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{item.invItemBrand}</TableCell>
                      <TableCell>
                        <Badge className="text-green-600 bg-green-200">
                          {item.invItemType}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.invItemStock}</TableCell>
                      <TableCell>₹{item.invItemPrice}</TableCell>
                      <TableCell>{item.invItemType}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
