"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const POSPage = () => {
  return (
    <div className="flex w-full h-full">
      {/* Item Selection Display */}
      <div className="flex-1 bg-red-500 p-4">
        {/* Content for item selection can go here */}
      </div>

      {/* POS Cart Display */}
      <div className="w-1/3 bg-green-500 p-4">
        {/* Content for cart display can go here */}
      </div>
    </div>
  );
};

export default POSPage;
