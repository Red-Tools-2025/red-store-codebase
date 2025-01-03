import { Employee } from "@prisma/client";
import { RoleType } from "@prisma/client";

import EmployeeTableController from "../../Tables/EmployeeTableController";
import EmployeeDataTable from "../../Tables/EmployeeDataTable";
import { useEffect, useState } from "react";

interface EmployeeControlPanelProps {
  employeeData: Employee[] | null;
}

const EmployeeControlPanel: React.FC<EmployeeControlPanelProps> = ({
  employeeData,
}) => {
  const [searchValue, setSearchValue] = useState<String>("");
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  // States to handle filters
  const [roleFilterValue, setRoleFilterValue] = useState<String>("All");
  const [statusFilterValue, setStatusFilterValue] = useState<String>("All");

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
    <div className="flex-col w-1/2">
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
