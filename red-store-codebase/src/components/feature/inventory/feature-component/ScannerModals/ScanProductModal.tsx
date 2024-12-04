import { CameraEnhancer, PlayCallbackInfo } from "dynamsoft-camera-enhancer";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";
import { ReactNode } from "react";

interface ScanProductModalProps {
  isActive?: boolean;
  onClose: () => void; // Function to close the scanner
  children?: ReactNode;
  interval?: number;
  license?: string;
  onInitialized?: (enhancer: CameraEnhancer, reader: BarcodeReader) => void;
  onScanned?: (results: TextResult[]) => void;
  onPlayed?: (playCallbackInfo: PlayCallbackInfo) => void;
  onClosed?: () => void;
}

const ScanProductModal = () => {};

export default ScanProductModal;
