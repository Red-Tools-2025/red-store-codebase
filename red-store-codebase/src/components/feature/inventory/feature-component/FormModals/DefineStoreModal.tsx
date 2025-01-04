import { DialogHeader } from "@/components/ui/dialog";
import { IconType } from "react-icons/lib";
import { BsBorderWidth } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { LetterText, LucideProps, Sigma } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import {
  DefineStoreFormValidation,
  DefineStoreFormValidationSelect,
} from "@/lib/formik/formik";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdRemoveCircle } from "react-icons/md";
import useStoreActions from "@/app/hooks/inventory/StaticHooks/useStoreActions";
import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import { InventoryCustomFieldsRequestBody } from "@/app/types/inventory/api";
import { Spinner } from "@/components/ui/spinner";

interface DefineStoreFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StoreDefination {
  fieldName: string;
  label: string;
  type: string;
  // below fields are only for select type
  allowedValues?: string[];
}

interface StoreDataTypeBoxProps {
  title: string;
  dataType: string;
  selectedDataType: string;
  setDataType: React.Dispatch<React.SetStateAction<string>>;
  icon:
    | IconType
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
}

const StoreDataTypeBox: React.FC<StoreDataTypeBoxProps> = ({
  icon,
  title,
  dataType,
  selectedDataType,
  setDataType,
}) => {
  const isSelected = selectedDataType === dataType;

  return (
    <div
      onClick={() => setDataType(dataType)}
      className={`flex flex-col transition px-10 py-5 border rounded-md cursor-pointer 
        ${
          isSelected
            ? "border-blue-500 bg-blue-100"
            : "border-gray-200 hover:bg-gray-100"
        }`}
    >
      <div
        className={`p-5 text-xl rounded-full transition 
          ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gradient-to-b from-gray-200 to-white"
          }`}
      >
        {React.createElement(icon)}
      </div>
      <p
        className={`text-center font-[500] text-sm mt-2 transition 
          ${isSelected ? "text-blue-700" : "text-gray-800"}`}
      >
        {title}
      </p>
    </div>
  );
};

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  handleModalClose: () => void;
  handleProceed: () => void;
  isCreatingStoreDefinitions: boolean;
}> = ({
  handleModalClose,
  isOpen,
  handleProceed,
  isCreatingStoreDefinitions,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-[500px] font-inter ">
        <DialogHeader>
          <DialogTitle>Confirm Store Definitions</DialogTitle>
          <DialogDescription>
            Are you sure you want to declare this as your additional inventory
            fields ? As this action is irreversible. We would recommend you to
            go back and confirm everything once
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={handleModalClose}>
            Go back
          </Button>
          <Button onClick={handleProceed} variant="primary">
            {isCreatingStoreDefinitions ? <Spinner /> : "Confirm & Proceed"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StoreDataTypeDetails: React.FC<{
  type: string;
  handleDataTypeAdd: (newDataType: StoreDefination) => void;
}> = ({ type, handleDataTypeAdd }) => {
  const [allowedValues, setAllowedValues] = useState<string[]>([]);
  const [allowedValueEntry, setAllowedValueEntry] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      fieldName: "",
      type: type,
      label: "",
      allowedValues: [] as string[], // Include allowedValues for "select" type
    },
    validationSchema:
      type === "select"
        ? DefineStoreFormValidationSelect
        : DefineStoreFormValidation,
    onSubmit: (values) => {
      handleDataTypeAdd(values);
      formik.resetForm();
      setAllowedValues([]);
    },
  });

  // Set the type value dynamically as the user selects a data type
  useEffect(() => {
    formik.setFieldValue("type", type);
  }, [type]);

  // Generate fieldName dynamically as the user types into the label field
  useEffect(() => {
    const toSnakeCase = (label: string): string => {
      return label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "_"); // Replace spaces with underscores
    };

    formik.setFieldValue("fieldName", toSnakeCase(formik.values.label));
  }, [formik.values.label]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-4">
        <div className="col-span-1">
          <Label htmlFor="label">Field Name</Label>
          <Input
            id="label"
            name="label"
            type="text"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.fieldName && formik.errors.fieldName && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.fieldName}
            </div>
          )}
        </div>

        {type === "select" && (
          <div className="col-span-1">
            <Label htmlFor="allowedValues">Allowed Values</Label>
            <Input
              id="allowedValues"
              name="allowedValues"
              type="text"
              value={allowedValueEntry}
              placeholder="Add a value and press Enter"
              onChange={(e) => setAllowedValueEntry(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  allowedValueEntry.trim() !== "" &&
                  allowedValues.includes(allowedValueEntry.trim()) === false
                ) {
                  e.preventDefault();
                  setAllowedValues([
                    ...allowedValues,
                    allowedValueEntry.trim(),
                  ]);
                  formik.setFieldValue("allowedValues", [
                    ...allowedValues,
                    allowedValueEntry.trim(),
                  ]);
                  setAllowedValueEntry("");
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {allowedValues.map((value, index) => (
                <div
                  key={index}
                  className="flex text-xs items-center text-blue-600 gap-1 bg-blue-100 border border-1 border-blue-500 px-2 py-1 rounded"
                >
                  <span>{value}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newValues = allowedValues.filter(
                        (_, i) => i !== index
                      );
                      setAllowedValues(newValues);
                      formik.setFieldValue("allowedValues", newValues);
                    }}
                    className="text-blue-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {formik.touched.allowedValues && formik.errors.allowedValues && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.allowedValues}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex mt-4">
        <Button type="submit" variant="primary">
          Add Field
        </Button>
      </div>
    </form>
  );
};

const DefineStoreModal: React.FC<DefineStoreFormProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedStore } = useInventory();
  const { handleCreateStoreDefinitions } = useStoreActions();
  const [creatingDefinitions, setCreatingDefinitions] =
    useState<boolean>(false);
  const [openConfirmDefinitionsModal, setOpenConfirmDefinitionsModal] =
    useState<boolean>(false);
  const [selectedDataType, setSelectedDataType] =
    React.useState<string>("text");
  const [storeDefination, setStoreDefination] = React.useState<
    StoreDefination[]
  >([]);

  const handleAddStoreDefination = (newDefination: StoreDefination) => {
    setStoreDefination([...storeDefination, newDefination]);
  };

  const handleRemoveStoreDefination = (index: number) => {
    setStoreDefination(storeDefination.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (!selectedStore) return;
    const request_body: InventoryCustomFieldsRequestBody = {
      customfields: storeDefination,
      storeId: selectedStore?.storeId,
      storeManagerId: selectedStore?.storeManagerId,
    };
    handleCreateStoreDefinitions(
      request_body,
      setCreatingDefinitions,
      () => setOpenConfirmDefinitionsModal(false),
      onClose
    ).catch((err) => console.log(err));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] font-inter flex gap-6 items-start">
        <ConfirmDialog
          isCreatingStoreDefinitions={creatingDefinitions}
          isOpen={openConfirmDefinitionsModal}
          handleModalClose={() => setOpenConfirmDefinitionsModal(false)}
          handleProceed={handleProceed}
        />
        {/* Left Section: Dialog Form */}
        <div className="w-2/3 pr-4 border-r flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <DialogHeader className="mt-1">
              <DialogTitle>Define Your Store</DialogTitle>
              <DialogDescription>
                Store definitions allow you to customize your inventory with
                your own fields alongside the base definitions we provide.
              </DialogDescription>
            </DialogHeader>

            {/* Data Type Selection */}
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">Pick a data type</p>
              <div className="flex gap-4">
                <StoreDataTypeBox
                  selectedDataType={selectedDataType}
                  setDataType={setSelectedDataType}
                  dataType="text"
                  title="Text"
                  icon={LetterText}
                />
                <StoreDataTypeBox
                  selectedDataType={selectedDataType}
                  setDataType={setSelectedDataType}
                  dataType="select"
                  title="Select"
                  icon={BsBorderWidth}
                />
                <StoreDataTypeBox
                  selectedDataType={selectedDataType}
                  setDataType={setSelectedDataType}
                  dataType="number"
                  title="Number"
                  icon={Sigma}
                />
              </div>
            </div>

            {/* Data Type Details */}
            <StoreDataTypeDetails
              handleDataTypeAdd={handleAddStoreDefination}
              type={selectedDataType}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => setOpenConfirmDefinitionsModal(true)}
              variant="primary"
              disabled={storeDefination.length === 0}
            >
              Proceed to Add
            </Button>
          </div>
        </div>

        {/* Right Section: Display Added Fields */}
        <div className="w-2/3 flex flex-col space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight">
              Defined Data Types
            </h3>
            <p className="text-sm text-muted-foreground">
              Your defined data types will be visible below where you can remove
              and add them again as well.
            </p>
          </div>
          {storeDefination.length === 0 ? (
            <p className="text-gray-500">No fields added yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {storeDefination.map((field, index) => (
                <li
                  key={index}
                  className="flex py-1 border-b-2 border-gray-200 items-center justify-between"
                >
                  <p className="">
                    {field.label}
                    {field.allowedValues && field.allowedValues.length > 0 ? (
                      <span className="text-xs ml-1 text-black rounded-md">
                        {`(${field.allowedValues?.length})`}
                      </span>
                    ) : null}
                    <span className="text-xs italic text-gray-400 ml-2">
                      {`{${field.fieldName}}`}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <p className="text-xs font-[600] text-blue-500">
                      {field.type}
                    </p>
                    <MdRemoveCircle
                      onClick={() => handleRemoveStoreDefination(index)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DefineStoreModal;
