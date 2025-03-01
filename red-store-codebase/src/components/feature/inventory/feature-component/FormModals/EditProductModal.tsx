/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
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

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTypes: string[];
  product: Inventory; // Existing product to be edited
}

interface StoreDefinition {
  fieldName: string;
  label: string;
  type: string;
  allowedValues?: string[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  productTypes,
  product,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { selectedStore, handleRefresh } = useInventory();

  // Fetch custom fields from store settings
  const customFields =
    (selectedStore?.customfields as unknown as StoreDefinition[]) || [];

  // Set initial values dynamically
  const initialValues = {
    invItem: product.invItem || "",
    invItemBrand: product.invItemBrand || "",
    invItemType: product.invItemType || "",
    invItemPrice: String(product.invItemPrice) || "",
    invItemStock: String(product.invItemStock) || "",
    invItemBarcode: product.invItemBarcode || "",
    ...customFields.reduce((acc, field) => {
      acc[field.fieldName] = product.invAdditional?.[field.fieldName] || "";
      return acc;
    }, {} as { [key: string]: string }),
  };

  const formik = useFormik({
    initialValues,
    validationSchema: AddProductFormValidation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Collect dynamic custom field values
        const invAdditional = customFields.reduce(
          (acc: { [key: string]: string }, field) => {
            acc[field.fieldName] = values[field.fieldName];
            return acc;
          },
          {}
        );

        const updatedProduct: Partial<Inventory> = {
          invItem: values.invItem,
          invItemBrand: values.invItemBrand,
          invItemStock: Number(values.invItemStock),
          invItemPrice: Number(values.invItemPrice),
          invItemType: values.invItemType,
          invItemBarcode: values.invItemBarcode,
          invAdditional,
        };

        const requestBody = {
          storeId: selectedStore?.storeId,
          updates: updatedProduct,
        };

        console.log("Sending request to API:", requestBody);

        await axios.put(
          `/api/inventory/products/${product.invId}`,
          requestBody
        );

        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "default",
        });

        onClose();
        handleRefresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
          variant: "destructive",
        });
        console.error("Error updating product:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Modify the product details and save.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={formik.handleSubmit}
          className="py-4 grid grid-cols-2 gap-4"
        >
          {/* Standard Form Fields */}
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

          {/* Dropdown Field for Product Type */}
          <div className="col-span-1">
            <Label htmlFor="invItemType">Package Type</Label>
            <Select
              name="invItemType"
              onValueChange={(value) =>
                formik.setFieldValue("invItemType", value)
              }
              value={formik.values.invItemType}
            >
              <SelectTrigger>
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
          </div>

          <div className="col-span-1">
            <Label htmlFor="invItemBarcode">Barcode</Label>
            <Input
              id="invItemBarcode"
              name="invItemBarcode"
              type="text"
              disabled
              value={formik.values.invItemBarcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Custom Fields Dynamically Rendered */}
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
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {field.allowedValues?.map((type, i) => (
                        <SelectItem key={i} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.fieldName}
                  name={field.fieldName}
                  type="text"
                  value={formik.values[field.fieldName]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              )}
            </div>
          ))}

          <DialogFooter className="col-span-2 mt-5 flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={!formik.dirty || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose} // Close modal without saving
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
