import * as Yup from "yup";

export const AddProductFormValidation = Yup.object({
  invItem: Yup.string().required("Product name is required"),
  invItemBrand: Yup.string().required("Brand is required"),
  invItemType: Yup.string().required("Product type is required"),
  invItemPrice: Yup.number().required("Price is required"),
  invItemStock: Yup.number().required("Stock is required"),
  invItemBarcode: Yup.string().nullable(),
  invItemSize: Yup.number().nullable(),
  category: Yup.string().required("Category is required"),
  amount: Yup.string().required("Bottle Amount is required"),
  measurement: Yup.string().required("Measurement is required"),
});
