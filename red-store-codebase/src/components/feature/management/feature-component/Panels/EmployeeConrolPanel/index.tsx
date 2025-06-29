import { Employee as PrismaEmployee } from "@prisma/client";
import { RoleType } from "@prisma/client";

import EmployeeTableController from "../../Tables/EmployeeTableController";
import EmployeeDataTable from "../../Tables/EmployeeDataTable";
import { useEffect, useState } from "react";

interface Role {
  roleType: string;
}

// Extend the existing Employee type to include role
interface Employee extends PrismaEmployee {
  role: Role; // Now Employee has a role field
  // Extending on store name for management table
  store: {
    storeName: string;
  };
}

interface EmployeeControlPanelProps {
  employeeData: Employee[] | null;
}

const EmployeeControlPanel: React.FC<EmployeeControlPanelProps> = ({
  employeeData,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  // States to handle filters
  const [roleFilterValue, setRoleFilterValue] = useState<string>("All");
  const [statusFilterValue, setStatusFilterValue] = useState<string>("All");

  // A role constant to map IDs to the right roles, // find more efficient way to update and parse in the futre
  // Array positions correspond to the relevant role Ids to the role types
  const roleValues = [
    RoleType.SALES,
    RoleType.MANAGER,
    RoleType.INVENTORY_STAFF,
    RoleType.STORE_MANAGER,
  ];

  const roleMapping: Record<number, string> = {
    [1]: "SALES",
    [2]: "MANAGER",
    [3]: "INVENTORY_STAFF",
    [4]: "STORE_MANAGER",
  };

  // Effect to watch for updates in employeeData
  useEffect(() => {
    if (employeeData) {
      const uniqueRoles = employeeData.reduce<
        {
          value: string;
          label: string;
        }[]
      >((accumulator, employee) => {
        if (employee.roleId.length > 0) {
          employee.roleId.forEach((id) => {
            if (!accumulator.some((role) => role.value === id.toString())) {
              accumulator.push({
                value: id.toString(),
                label: roleMapping[id] || "Unknown Role",
              });
            }
          });
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
    <div className="w-full overflow-x-auto">
      <EmployeeTableController
        roles={roles}
        employeeData={employeeData}
        setSearchValue={setSearchValue}
        setRoleFilterValue={setRoleFilterValue}
        setStatusFilterValue={setStatusFilterValue}
      />
      <EmployeeDataTable
        roleValues={roleValues}
        statusFilterValue={statusFilterValue}
        roleFilterValue={roleFilterValue}
        searchValue={searchValue}
        employeeData={employeeData}
      />
    </div>
  );
};

export default EmployeeControlPanel;
