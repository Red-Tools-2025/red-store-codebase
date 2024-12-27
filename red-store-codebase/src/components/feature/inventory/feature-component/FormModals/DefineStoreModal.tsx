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

const StoreDataTypeDetails: React.FC<{ type: string }> = ({ type }) => {
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
      console.log(values);
      console.log(type);
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

        {/* Dynamically Generated Field Name */}
        <div className="col-span-1">
          <Label htmlFor="fieldName">Field Name (Programmatic)</Label>
          <Input
            id="fieldName"
            name="fieldName"
            type="text"
            value={formik.values.fieldName}
            disabled
            readOnly
            placeholder="Field name will be generated here"
          />
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
                  className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
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
                    className="text-red-500 font-bold"
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
  const [selectedDataType, setSelectedDataType] =
    React.useState<string>("text");
  const [storeDefination, setStoreDefination] = React.useState<
    StoreDefination[]
  >([]);

  const handleAddStoreDefination = (newDefination: StoreDefination) => {
    setStoreDefination([...storeDefination, newDefination]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] font-inter">
        <DialogHeader>
          <DialogTitle>Define Your Store</DialogTitle>
          <DialogDescription>
            Store definations allow you to customize your inventory as your own
            along with the base definations we provide to store your data
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <p className="font-[600]">Pick a data type</p>
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
        <StoreDataTypeDetails type={selectedDataType} />
        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={onClose} variant="secondary">
            Proceed to Add
          </Button>
          <Button onClick={onClose} variant="primary">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DefineStoreModal;
