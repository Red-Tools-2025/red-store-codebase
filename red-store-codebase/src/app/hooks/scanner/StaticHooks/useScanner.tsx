import { TextResult } from "dynamsoft-javascript-barcode";
import { useEffect, useState } from "react";

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

  return {
    onScanned,
    toggleScanning,
    closeScanner,
    setInitializedScanner,
    openScanner,
    initializedScanner,
    license,
  };
};

export default useScanner;
