/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { LuScanFace } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/app/contexts/inventory/InventoryContext";
import { Inventory } from "@prisma/client";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { AddProductFormValidation } from "@/lib/formik/formik";
import BarcodeScanner from "@/components/BarcodeScanner";
import useScanner from "@/app/hooks/scanner/StaticHooks/useScanner";

interface AddProductModalProps {
  isOpen: boolean;
  productTypes: string[];
  onClose: () => void;
}

interface StoreDefination {
  fieldName: string;
  label: string;
  type: string;
  // below fields are only for select type
  allowedValues?: string[];
}

interface intitialAddProductFormValues {
  invItem: string;
  invItemBrand: string;
  invItemType: string;
  invItemPrice: string;
  invItemStock: string;
  invItemBarcode: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productTypes,
}) => {
  const { handleRefresh } = useInventory();
  const { toast } = useToast();
  const {
    closeScanner,
    onScannedAddProduct,
    toggleScanning,
    setInitializedScanner,
    openScanner,
    initializedScanner,
    license,
  } = useScanner();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [initial_v, setInitial_v] = useState<{ [key: string]: string }>({});
  const [dynamicFormValidation, setDynamicFormValidation] =
    useState<Yup.ObjectSchema<any> | null>(null);
  const { sessionData, selectedStore } = useInventory();

  const customFields =
    (selectedStore?.customfields as unknown as StoreDefination[]) || [];

  useEffect(() => {
    if (!customFields.length) {
      setIsFormLoading(false);
      return;
    }

    // Prepare initial values and validation schema dynamically
    const base_initial_values: intitialAddProductFormValues = {
      invItem: "",
      invItemBrand: "",
      invItemType: "",
      invItemPrice: "",
      invItemStock: "",
      invItemBarcode: "",
    };

    const dynamic_initial_values = customFields.reduce(
      (acc: { [key: string]: string }, field) => {
        acc[field.fieldName] = ""; // Dynamically add custom field to initial values
        return acc;
      },
      { ...base_initial_values }
    );

    const dynamicValidationSchema = Yup.object({
      ...AddProductFormValidation.fields,
      ...customFields.reduce(
        (acc: { [key: string]: Yup.StringSchema }, field) => {
          acc[field.fieldName] = Yup.string().required(
            `${field.label} is required`
          );
          return acc;
        },
        {}
      ),
    });

    setInitial_v(dynamic_initial_values);
    setDynamicFormValidation(dynamicValidationSchema);
    setIsFormLoading(false);
  }, [customFields]);

  const formik = useFormik({
    initialValues: initial_v,
    validationSchema: dynamicFormValidation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        // building the invAdditional
        const invAdditional = customFields.reduce(
          (acc: { [key: string]: string }, field) => {
            acc[field.fieldName] = values[field.fieldName];
            return acc;
          },
          {}
        );
        const newProduct: Partial<Inventory> = {
          storeId: selectedStore?.storeId,
          storeManagerId: sessionData?.id,
          invItem: values.invItem,
          invItemBrand: values.invItemBrand,
          invItemStock: Number(values.invItemStock),
          invItemPrice: Number(values.invItemPrice),
          invItemType: values.invItemType,
          invCreatedDate: new Date(),
          invItemBarcode: values.invItemBarcode,

          invAdditional: invAdditional,
        };
        const response = await axios.post<{
          message: string;
          inventory: Inventory;
        }>("/api/inventory/products", newProduct);

        // Success toast
        toast({
          title: "Success",
          description: response.data.message || "Product added successfully",
          variant: "default",
        });
        handleRefresh();
        formik.resetForm();
        setIsSubmitting(false);
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Error",
            description:
              error.response?.data?.error ||
              "Failed to add product. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        console.error("Error adding product:", error);
      } finally {
        setIsSubmitting(false);
      }
      // console.log({ values });
    },
  });

  if (isFormLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to the inventory.
          </DialogDescription>
        </DialogHeader>
        <BarcodeScanner
          license={license}
          onInitialized={() => setInitializedScanner(true)}
          isActive={openScanner}
          onScanned={(results) =>
            onScannedAddProduct(results, formik.setFieldValue)
          }
          onClose={closeScanner} // Pass onClose function here
        />
        <form
          onSubmit={formik.handleSubmit}
          className="py-4 grid grid-cols-2 gap-4"
        >
          <div className="col-span-1">
            <Label htmlFor="invItem">Product Name</Label>
            <Input
              id="invItem"
              name="invItem"
              type="text"
              value={formik.values.invItem}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItem && formik.errors.invItem && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItem}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemBrand">Brand</Label>
            <Input
              id="invItemBrand"
              name="invItemBrand"
              type="text"
              value={formik.values.invItemBrand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemBrand && formik.errors.invItemBrand && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemBrand}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemType">Package Type</Label>
            <Select
              name="invItemType"
              onValueChange={(value) =>
                formik.setFieldValue("invItemType", value)
              }
              value={formik.values.invItemType}
            >
              <SelectTrigger className="w-full data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.invItemType && formik.errors.invItemType && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemType}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemPrice">Price</Label>
            <Input
              id="invItemPrice"
              name="invItemPrice"
              type="number"
              value={formik.values.invItemPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemPrice && formik.errors.invItemPrice && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemPrice}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemStock">Stock</Label>
            <Input
              id="invItemStock"
              name="invItemStock"
              type="number"
              value={formik.values.invItemStock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.invItemStock && formik.errors.invItemStock && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.invItemStock}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="invItemBarcode">Barcode</Label>
            <Input
              id="invItemBarcode"
              name="invItemBarcode"
              type="string"
              value={formik.values.invItemBarcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {/* <div className="col-span-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.category}
              </div>
            )}
          </div> */}
          {customFields.map(
            (
              field,
              index // Map over custom fields
            ) => (
              <div key={index} className="col-span-1">
                <Label htmlFor={field.fieldName}>{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    name={field.fieldName}
                    onValueChange={(value) =>
                      formik.setFieldValue(field.fieldName, value)
                    }
                    value={formik.values[field.fieldName]}
                  >
                    <SelectTrigger className="w-full data-[placeholder]:text-muted-foreground">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.allowedValues &&
                        field.allowedValues.length > 0 && (
                          <SelectGroup>
                            {field.allowedValues.map((type, index) => (
                              <SelectItem key={index} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.fieldName}
                    name={field.fieldName}
                    type={field.type}
                    value={formik.values[field.fieldName]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched[field.fieldName] &&
                  formik.errors[field.fieldName] && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors[field.fieldName]}
                    </div>
                  )}
              </div>
            )
          )}
          {/* <div className="col-span-1">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              onValueChange={(value) => formik.setFieldValue("category", value)}
              value={formik.values.category}
            >
              <SelectTrigger className="w-full data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productCategories.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.category}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="size">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </div>
            )}
          </div> */}
          {/* <div className="col-span-1">
            <Label htmlFor="measurement">Measurement</Label>
            <Input
              id="measurement"
              name="measurement"
              type="text"
              value={formik.values.measurement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.measurement && formik.errors.measurement && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.measurement}
              </div>
            )}
          </div> */}
          {/* <div className="col-span-1">
            <Label htmlFor="measurement">Measurement</Label>
            <Select
              name="measurement"
              onValueChange={(value) =>
                formik.setFieldValue("measurement", value)
              }
              value={formik.values.measurement}
            >
              <SelectTrigger className="w-full data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="Select measurement" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {amountMeasurements.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.measurement && formik.errors.measurement && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.measurement}
              </div>
            )}
          </div> */}
          <DialogFooter className="col-span-2 mt-5">
            {initializedScanner ? (
              <>
                <Button type="button" onClick={toggleScanning}>
                  <div className="flex items-center gap-2">
                    <LuScanFace size={16} />
                    <p>Scan</p>
                  </div>
                </Button>
              </>
            ) : (
              <div>Initializing...</div>
            )}
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
