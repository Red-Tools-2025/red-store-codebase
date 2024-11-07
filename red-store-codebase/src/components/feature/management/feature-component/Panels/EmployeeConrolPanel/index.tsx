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

  // Effect to watch for updates in employeeData
  useEffect(() => {
    if (employeeData) {
      // Ensure only unique role values, hence relevant options for filtering data
      const uniqueRoles = employeeData.reduce<
        { value: string; label: string }[]
      >((accumulator, employee) => {
        if (employee) {
          // Access roleType from role object
          if (
            !accumulator.some(
              (item) => item.value === employee.roleId.toString()
            )
          ) {
            accumulator.push({
              value: employee.roleId.toString(),
              label: roleValues[employee.roleId],
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
