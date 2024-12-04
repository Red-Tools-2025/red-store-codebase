import { TextResult } from "dynamsoft-javascript-barcode";
import { FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AddProductFormValidation } from "@/lib/formik/formik";
import { AddProductModalValues } from "@/lib/formik/formikValueTypes";

const useScanner = () => {
  const [openScanner, setOpenScanner] = useState<boolean>(false);
  const [initializedScanner, setInitializedScanner] = useState(false);
  const [license, setLicense] = useState<string>("");

  useEffect(() => {
    const loadLicense = async () => {
      const fetchedLicense = await fetchLicense();
      setLicense(fetchedLicense);
    };
    loadLicense();
  }, []);

  const toggleScanning = () => setOpenScanner(!openScanner);
  const closeScanner = () => setOpenScanner(false);

  // function for fetching license authorization
  async function fetchLicense() {
    let license: string | undefined = process.env.DBRLicense;
    if (license === undefined) {
      license = "";
    }
    return license;
  }

  // basic scanned function for testing
  const onScanned = (results: TextResult[]) => {
    if (results.length > 0) {
      let text = "";
      for (let index = 0; index < results.length; index++) {
        const result = results[index];
        text =
          text + result.barcodeFormatString + ": " + result.barcodeText + "\n";
      }
      alert(text);
      setOpenScanner(false);
    }
  };

  // function for scanning barcode and populating field
  const onScannedAddProduct = (
    results: TextResult[],
    setValue: FormikHelpers<AddProductModalValues>["setFieldValue"]
  ) => {
    if (results.length > 0) {
      const scannedResult = results[0];
      const barcodeText = scannedResult.barcodeText;

      if (setValue) {
        setValue("invItemBarcode", barcodeText, true);
      } else {
        alert(`${scannedResult.barcodeFormatString}: ${barcodeText}`);
      }
      setOpenScanner(false);
    }
  };

  // function for scanning barcodes for the purpose of finding items
  const onScannedSearchProduct = (
    results: TextResult[],
    setSearchItemBarcode: Dispatch<SetStateAction<string>>
  ) => {
    if (results.length > 0) {
      const scannedResult = results[0];
      const barcodeText = scannedResult.barcodeText;
      setSearchItemBarcode(barcodeText);
      setOpenScanner(false);
    }
  };

  return {
    onScanned,
    onScannedAddProduct,
    onScannedSearchProduct,
    toggleScanning,
    closeScanner,
    setInitializedScanner,
    openScanner,
    initializedScanner,
    license,
  };
};

export default useScanner;
