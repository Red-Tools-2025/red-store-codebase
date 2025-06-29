"use client";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import FilterDropdown from "../Filter";
import { Employee } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/app/providers/StoreProvider";
import { MdOutlineAssignment } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { IoStorefront } from "react-icons/io5";
import AddStoreModal from "../FormModals/AddStoreModal";
import AddEmployeeModal from "../FormModals/AddEmployeeModal";
import AssignEmployeeModal from "../FormModals/AssignEmployeeModal";

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
  const { selectedStore, storeData } = useStoreContext();

  const [isStoreModalOpen, setisStoreModalOpen] = useState<boolean>(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState<boolean>(false);

  const handleOpenModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(true);
  };

  const handleCloseModal = (
    setModalType: React.Dispatch<SetStateAction<boolean>>
  ) => {
    setModalType(false);
  };

  // Creating Map for O(1) look up, to be done for all cases handling dynamic data as select options
  // Maps to be used in future modals, but now the assign modal

  const empMap = useMemo(() => {
    if (!employeeData) return null;
    return new Map(
      employeeData
        .filter((emp) => emp.storeId === selectedStore?.storeId)
        .map((emp) => [emp.empId.toString(), emp])
    );
  }, [employeeData, selectedStore]);

  const storeMap = useMemo(() => {
    if (!storeData) return null;
    return new Map(
      storeData
        .filter((store) => store.storeId != selectedStore?.storeId)
        .map((store) => [store.storeId.toString(), store])
    );
  }, [storeData, selectedStore]);

  return (
    <div className="flex gap-3">
      {employeeData ? (
        <div className="flex flex-row gap-2 w-full items-center">
          <Input
            placeholder="Search employee"
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-1/3"
          />
          <div className="flex gap-2 items-center">
            <FilterDropdown
              label="Role"
              options={roles}
              onValueChange={(value) =>
                setRoleFilterValue(value === "All" ? "All" : value)
              }
            />
          </div>

          <div className="ml-auto flex gap-2">
            <div className="flex gap-2">
              <Button
                disabled={selectedStore ? false : true}
                onClick={() => handleOpenModal(setAssignModalOpen)}
                variant={"secondary"}
              >
                <MdOutlineAssignment className="mr-2" />
                Assign Employee
              </Button>
              <Button
                disabled={selectedStore ? false : true}
                onClick={() => handleOpenModal(setIsEmpModalOpen)}
                variant={"secondary"}
              >
                <IoMdPersonAdd className="mr-2" />
                Add Employee
              </Button>
              <Button
                onClick={() => handleOpenModal(setisStoreModalOpen)}
                variant={"new_prime"}
              >
                <IoStorefront className="mr-2" />
                Add Store
              </Button>
              {/* Modals */}
              <AddStoreModal
                isOpen={isStoreModalOpen}
                onClose={() => handleCloseModal(setisStoreModalOpen)}
              />
              <AddEmployeeModal
                isOpen={isEmpModalOpen}
                onClose={() => handleCloseModal(setIsEmpModalOpen)}
              />
              <AssignEmployeeModal
                empDataMap={empMap}
                storeDataMap={storeMap}
                isOpen={isAssignModalOpen}
                onClose={() => handleCloseModal(setAssignModalOpen)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 py-1 rounded-sm bg-red-200 text-red-600">
          No employee data available to process
        </div>
      )}
    </div>
  );
};

export default EmployeeTableController;
