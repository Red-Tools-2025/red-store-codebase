import { TableCell, TableRow } from "@/components/ui/table";
import { Employee as PrismaEmployee } from "@prisma/client";
import TableLayout from "../../layouts/TableLayout";
import { useMemo } from "react";
import { useManagement } from "@/app/contexts/management/ManagementContext";

interface Role {
  roleType: string;
}

interface Employee extends PrismaEmployee {
  role: Role;
  store: {
    storeName: string;
  };
}

interface EmployeeDataTableProps {
  employeeData: Employee[] | null;
  searchValue: string;
  roleFilterValue: string | "All";
  statusFilterValue: string;
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
  const headers: string[] = [
    "Employee ID",
    "Employee Name",
    "Phone",
    "Role",
    "Status",
    "Store",
    "Date Joined",
    // Add more fields here if needed
  ];

  const filteredData = useMemo(() => {
    if (!employeeData) return null;

    let filtered = employeeData;

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

  const tableRows = filteredData
    ?.filter((employee) =>
      statusFilterValue === "active"
        ? employee.empStatus === true
        : statusFilterValue === "inactive"
        ? employee.empStatus === false
        : true
    )
    .map((employee, index) => (
      <TableRow key={index} className="border-l border-r border-gray-300">
        <TableCell className="border-l border-gray-300">{`#${employee.empId}`}</TableCell>
        <TableCell
          className={index === filteredData.length - 1 ? "rounded-bl-lg" : ""}
        >
          {employee.empName}
        </TableCell>
        <TableCell>{employee.empPhone}</TableCell>
        <TableCell className="flex pt-3 gap-2">
          {employee.roleId.map((roleId, i) => (
            <p
              key={i}
              className={`text-[10px] px-2 rounded-full bg-blue-100 border border-blue-500 text-blue-500
              ${i !== employee.roleId.length - 1 ? "mr-2" : ""}
              border-b border-r
              `}
              style={{
                borderBottom: "1px solid #3b82f6",
                borderRight:
                  i !== employee.roleId.length - 1
                    ? "1px solid #3b82f6"
                    : undefined,
              }}
            >
              {roleValues[roleId - 1]}
            </p>
          ))}
        </TableCell>
        <TableCell>
          {employee.empStatus ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-red-600">Inactive</span>
          )}
        </TableCell>
        <TableCell>{employee.store?.storeName}</TableCell>
        <TableCell className="border-r border-gray-300">
          {employee.createdAt
            ? new Date(employee.createdAt).toLocaleDateString()
            : "-"}
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col mt-5">
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
