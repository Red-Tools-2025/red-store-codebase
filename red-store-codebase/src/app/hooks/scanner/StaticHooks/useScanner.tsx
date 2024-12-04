import { TextResult } from "dynamsoft-javascript-barcode";
import { useState } from "react";

const useScanner = () => {
  const [openScanner, setOpenScanner] = useState<boolean>(false);

  const toggleScanning = () => setOpenScanner(!openScanner);
  const activateScanner = () => setOpenScanner(false);

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

  return { onScanned, toggleScanning, activateScanner, openScanner };
};

export default useScanner;
