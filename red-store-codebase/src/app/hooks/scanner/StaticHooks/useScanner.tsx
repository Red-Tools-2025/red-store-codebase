import { useRef, useEffect } from "react";
import { CameraEnhancer, PlayCallbackInfo } from "dynamsoft-camera-enhancer";
import { BarcodeReader, TextResult } from "dynamsoft-javascript-barcode";

interface UseScannerOptions {
  interval?: number;
  license?: string;
  onInitialized?: (enhancer: CameraEnhancer, reader: BarcodeReader) => void;
  onScanned?: (results: TextResult[]) => void;
  onPlayed?: (playCallbackInfo: PlayCallbackInfo) => void;
  onClosed?: () => void;
}

const useScanner = (options: UseScannerOptions) => {
  const container = useRef<HTMLDivElement | null>(null);
  const enhancer = useRef<CameraEnhancer | null>(null);
  const reader = useRef<BarcodeReader | null>(null);
  const intervalRef = useRef<number | null>(null);
  const decoding = useRef(false);

  useEffect(() => {
    const initializeScanner = async () => {
      if (!BarcodeReader.isWasmLoaded()) {
        BarcodeReader.license =
          options.license ||
          "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
        BarcodeReader.engineResourcePath =
          "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.11/dist/";
      }
      reader.current = await BarcodeReader.createInstance();
      enhancer.current = await CameraEnhancer.createInstance();
      await enhancer.current.setUIElement(container.current!);
      enhancer.current.on("played", (info: PlayCallbackInfo) => {
        options.onPlayed?.(info);
        startScanning();
      });
      enhancer.current.on("cameraClose", () => {
        options.onClosed?.();
      });
      enhancer.current.setVideoFit("cover");

      options.onInitialized?.(enhancer.current, reader.current);
    };

    initializeScanner();
    return () => stopScanning();
  }, []);

  const startScanning = () => {
    const decode = async () => {
      if (!decoding.current && reader.current && enhancer.current) {
        decoding.current = true;
        const results = await reader.current.decode(
          enhancer.current.getFrame()
        );
        options.onScanned?.(results);
        decoding.current = false;
      }
    };

    intervalRef.current = window.setInterval(decode, options.interval || 40);
  };

  const stopScanning = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const openCamera = async () => {
    await enhancer.current?.open(true);
  };

  const closeCamera = () => {
    stopScanning();
    enhancer.current?.close();
  };

  return {
    container,
    openCamera,
    closeCamera,
    enhancer,
    reader,
  };
};

export default useScanner;
