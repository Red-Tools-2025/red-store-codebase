import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InventoryPageSizeSelector() {
  const [selectedPageSize, setSelectedPageSize] = useState<number>(10);

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">Show</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-sm">
            {selectedPageSize}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={() => setSelectedPageSize(10)}>
            10
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedPageSize(20)}>
            20
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedPageSize(50)}>
            50
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedPageSize(100)}>
            100
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-sm text-gray-500">entries</p>
    </div>
  );
}
