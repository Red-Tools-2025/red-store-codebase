
import { useState, useEffect } from "react";

interface UseBarcodeScannerOptions {
  onScan?: (barcode: string) => void;
  enabled?: boolean;
}

export const useBarcodeScanner = ({ onScan, enabled = true }: UseBarcodeScannerOptions = {}) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<string>("");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const cleaned = buffer.trim();
        if (cleaned) {
          setScannedData(cleaned);
          if (onScan) {
            onScan(cleaned);
          }
        }
        setBuffer(""); // Clear buffer for next scan
      } else {
        // Only append if it's a printable character and not a modifier key
        if (e.key.length === 1) { // Basic check for single character keys
          setBuffer((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [buffer, onScan, enabled]);

  const clearScannedData = () => {
    setScannedData(null);
  };

  return { scannedData, clearScannedData };
};
