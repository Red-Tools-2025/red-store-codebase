"use client";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import FilterDropdown from "../Filter";
import { Employee } from "@prisma/client";

interface EmployeeTableControllerProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
  setRoleFilterValue: Dispatch<SetStateAction<string | "All">>;
  setStatusFilterValue: Dispatch<SetStateAction<string>>;
  employeeData: Employee[] | null;
  roles: { value: string; label: string }[]; // Converted to string for compatibility
}

const EmployeeTableController: React.FC<EmployeeTableControllerProps> = ({
  setSearchValue,
  employeeData,
  roles,
  setRoleFilterValue,
}) => {
  return (
    <div className="flex gap-3 justify-space">
      {employeeData ? (
        <>
          <Input
            placeholder="Search employee"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="flex gap-2">
            <FilterDropdown
              label="Role"
              options={roles}
              onValueChange={(value) =>
                setRoleFilterValue(value === "All" ? "All" : value)
              }
            />
          </div>
        </>
      ) : (
        <div className="px-3 py-1 rounded-sm bg-red-200 text-red-600">
          No employee data available to process
        </div>
      )}
    </div>
  );
};

export default EmployeeTableController;
