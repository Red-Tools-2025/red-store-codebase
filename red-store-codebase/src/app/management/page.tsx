"use client";
import React from "react";
import { useManagement } from "../contexts/management/ManagementContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table"; // Adjust path as needed

const ManagementPage: React.FC = () => {
  const { sessionData, storeData } = useManagement();

  return (
    <main>
      <div className="flex my-2 gap-2">
        <div className=" flex w-1/2 p-4 flex-col">
          <h1 className="text-lg font-semibold mb-2">Store Data</h1>
          {storeData && storeData.length > 0 ? (
            <Table>
              <TableHeader className="border">
                <TableRow>
                  <TableCell className="px-3 py-4 text-xs font-semibold text-gray-500">
                    Store ID
                  </TableCell>
                  <TableCell className="px-3 py-4 text-xs font-semibold text-gray-500">
                    Store Name
                  </TableCell>
                  <TableCell className="px-3 py-4 text-xs font-semibold text-gray-500">
                    Location
                  </TableCell>
                  <TableCell className="px-3 py-4 text-xs font-semibold text-gray-500">
                    Store Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeData.map((store, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-auto">{store.storeId}</TableCell>
                    <TableCell className="w-auto">{store.storeName}</TableCell>
                    <TableCell className="w-auto">{store.storeName}</TableCell>
                    <TableCell className="w-auto">
                      {/* link to Kafka, based on inventory activity status for rendering real time store status */}
                      {store.storeStatus ? (
                        <p className="bg-green-100 text-green-600 font-semibold inline-block w-auto px-3 py-1 rounded-sm">
                          Active
                        </p>
                      ) : (
                        <p>Inactive</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
              <p>No store data available</p>
            </div>
          )}
        </div>

        <div className="bg-green-300 flex w-1/2 p-4 flex-col">
          <h1 className="text-lg font-semibold mb-2">User Data</h1>
          {/* Render user-related data here */}
          {sessionData ? (
            <div>{/* Render session data here */}</div>
          ) : (
            <p className="text-center text-gray-700">No user data available</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagementPage;
