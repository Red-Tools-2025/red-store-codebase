"use client";
import { InfoCard } from "@/components/feature/management/info-card";
import { Input } from "@/components/ui/input";
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { IndianRupee } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const InventoryPage = () => {
  const [displayState, setDisplayState] = useState<string>("list");
  const [input, setInput] = useState<string>("");
  const [tempOpen, setTempOpen] = useState<boolean>(false);

  return (
    <div>
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
          {/* <div
            className={`flex items-center justify-center p-1.5 rounded-sm border cursor-pointer 
              ${
                tempOpen
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-300 border-gray-500 opacity-50"
              } transition-all duration-300 ease-in-out`}
            onClick={() => setTempOpen(!tempOpen)}
          >
            <SlOptionsVertical
              className={`text-md ${
                tempOpen ? "text-green-500" : "text-gray-500"
              } transition-all duration-300 ease-in-out`}
            />
          </div> */}
          <Button variant={"secondary"}>
            <SlOptionsVertical />
          </Button>
          <Button variant={"secondary"}>Add Product</Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
