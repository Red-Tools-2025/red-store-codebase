import { Employee as PrismaEmployee } from "@prisma/client";
import EmployeeTableController from "../../Tables/EmployeeTableController";
import EmployeeDataTable from "../../Tables/EmployeeDataTable";
import { useEffect, useState } from "react";

interface Role {
  roleType: string; // Adjust if you have more fields in the role
}

// Extend the existing Employee type to include role
interface Employee extends PrismaEmployee {
  role: Role; // Now Employee has a role field
}

interface EmployeeControlPanelProps {
  employeeData: Employee[] | null;
}
const EmployeeControlPanel: React.FC<EmployeeControlPanelProps> = ({
  employeeData,
}) => {
  const [searchValue, setSearchValue] = useState<String>("");
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  // States to handle filters
  const [roleFilterValue, setRoleFilterValue] = useState<String >("All");
  const [statusFilterValue, setStatusFilterValue] = useState<String>("All");

  // Effect to watch for updates in employeeData
  useEffect(() => {
    if (employeeData) {
      // Ensure only unique role values, hence relevant options for filtering data
      const uniqueRoles = employeeData.reduce<
        { value: string; label: string }[]
      >((accumulator, employee) => {
        if (employee.role?.roleType) {
          // Access roleType from role object
          if (
            !accumulator.some((item) => item.value === employee.role.roleType)
          ) {
            accumulator.push({
              value: employee.role.roleType, // Use roleType
              label: employee.role.roleType, // Adjust label as needed
            });
          }
        }
        return accumulator;
      }, []);

      // Adding "All" option for default filtering
      setRoles(uniqueRoles);
    } else {
      setRoles([]);
    }
  }, [employeeData]);

  return (
    <div className="flex-col w-1/2">
      <EmployeeTableController
        roles={roles}
        employeeData={employeeData}
        setSearchValue={setSearchValue}
        setRoleFilterValue={setRoleFilterValue}
        setStatusFilterValue={setStatusFilterValue}
      />
      <EmployeeDataTable
        statusFilterValue={statusFilterValue}
        roleFilterValue={roleFilterValue}
        searchValue={searchValue}
        employeeData={employeeData}
      />
    </div>
  );
};

export default EmployeeControlPanel;
