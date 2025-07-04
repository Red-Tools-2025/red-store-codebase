/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
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
import { MdAddBusiness } from "react-icons/md";
import BarcodeScanner from "@/components/BarcodeScanner";
import useScanner from "@/app/hooks/scanner/StaticHooks/useScanner";

interface AddProductPanelProps {
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

const AddProductPanel: React.FC<AddProductPanelProps> = ({
  isOpen,
  onClose,
  productTypes,
}) => {
  const { handleRefresh } = useInventory();
  const { toast } = useToast();
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
    },
  });

  if (isFormLoading) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent dir="right" className="w-96">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Loading...</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent dir="right" className="font-inter">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">
            <div className="flex flex-row gap-2 items-center">
              <MdAddBusiness className="text-red-600" size={30} />
              <p>Add New Product</p>
            </div>
          </DrawerTitle>
          <DrawerDescription>
            Fill in the details to add a new product to the inventory.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
          <div className="p-4 grid grid-cols-2 gap-x-5 gap-y-2 flex-1 overflow-y-auto">
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
            {customFields.map((field, index) => (
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
            ))}
          </div>

          <DrawerFooter className="flex-shrink-0 p-4 pt-2">
            <div className="flex flex-row gap-2">
              <Button type="submit" variant="new_prime" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddProductPanel;
