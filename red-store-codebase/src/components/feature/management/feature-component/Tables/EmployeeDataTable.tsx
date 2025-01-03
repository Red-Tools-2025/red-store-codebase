import { TableCell, TableRow } from "@/components/ui/table";
import { Employee, Employee as PrismaEmployee } from "@prisma/client";
import TableLayout from "../../layouts/TableLayout";
import { useMemo } from "react";
import { useManagement } from "@/app/contexts/management/ManagementContext";

interface EmployeeDataTableProps {
  employeeData: Employee[] | null;
  searchValue: String;
  roleFilterValue: String | "All";
  statusFilterValue: String;
  roleValues: ("SALES" | "MANAGER" | "INVENTORY_STAFF" | "STORE_MANAGER")[];
}

const roleMapping: Record<string, number> = {
  SALES: 1,
  MANAGER: 2,
  INVENTORY_STAFF: 3,
  STORE_MANAGER: 4,
};

const EmployeeDataTable: React.FC<EmployeeDataTableProps> = ({
  employeeData,
  searchValue,
  roleFilterValue,
  statusFilterValue,
  roleValues,
}) => {
  const { selectedStore } = useManagement();
  const headers: string[] = ["Employee ID", "Employee Name", "Role"];

  // Handle all filtering in one place with useMemo
  const filteredData = useMemo(() => {
    if (!employeeData) return null;

    let filtered = employeeData;

    // Apply search filter
    if (searchValue && searchValue.trim() !== "") {
      const searchValueLower = searchValue.toLowerCase();
      filtered = filtered.filter((employee) =>
        employee.empName.toLowerCase().includes(searchValueLower)
      );
    }

    if (selectedStore) {
      filtered = filtered.filter(
        (employee) => employee.storeId === selectedStore.storeId
      );
    }

    // Apply role filter - only filter if not "All"
    if (roleFilterValue !== "All") {
      const roleIdToFilter = roleMapping[roleFilterValue.toString()];
      if (roleIdToFilter) {
        filtered = filtered.filter((employee) =>
          employee.roleId.includes(roleIdToFilter)
        );
      }
    }

    return filtered;
  }, [employeeData, searchValue, roleFilterValue, selectedStore]);

  // Map directly to table rows without additional filtering
  const tableRows = filteredData
    ?.filter(
      (employee) =>
        statusFilterValue === "active"
          ? employee.empStatus === true
          : statusFilterValue === "inactive"
          ? employee.empStatus === false
          : true // Show all if statusFilterValue is "All"
    )
    .map((employee, index) => (
      <TableRow key={index}>
        <TableCell className="w-auto">{employee.empId}</TableCell>
        <TableCell className="w-auto">{employee.empName}</TableCell>
        <TableCell className="w-auto flex pt-3 gap-2">
          {employee.roleId.map((roleId, i) => {
            return (
              <p
                key={i}
                className="text-[10px] px-2 rounded-full bg-blue-100 border border-blue-500 text-blue-500"
              >
                {roleValues[roleId - 1]}
              </p>
            );
          })}
        </TableCell>{" "}
      </TableRow>
    ));

  console.log(employeeData);

  return (
    <div className="flex flex-col mt-3">
      {filteredData && filteredData.length > 0 ? (
        <TableLayout TableColumnValues={headers}>{tableRows}</TableLayout>
      ) : (
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
          <p>No employee data available</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDataTable;
