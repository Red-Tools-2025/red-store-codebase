import { CameraEnhancer } from "dynamsoft-camera-enhancer";
import { PlayCallbackInfo } from "dynamsoft-camera-enhancer";
import { TextResult, BarcodeReader } from "dynamsoft-javascript-barcode";
import React from "react";
import { ReactNode } from "react";

export interface ScannerProps {
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

const BarcodeScanner = (props: ScannerProps): React.ReactElement => {
  const mounted = React.useRef(false);
  const container = React.useRef(null);
  const enhancer = React.useRef<CameraEnhancer>();
  const reader = React.useRef<BarcodeReader>();
  const interval = React.useRef<any>(null);
  const decoding = React.useRef(false);

  React.useEffect(() => {
    const init = async () => {
      if (BarcodeReader.isWasmLoaded() === false) {
        if (props.license) {
          BarcodeReader.license = props.license;
        } else {
          BarcodeReader.license =
            "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
        }
        BarcodeReader.engineResourcePath =
          "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.11/dist/";
      }
      reader.current = await BarcodeReader.createInstance();
      enhancer.current = await CameraEnhancer.createInstance();
      await enhancer.current.setUIElement(container.current!);
      enhancer.current.on("played", (playCallbackInfo: PlayCallbackInfo) => {
        if (props.onPlayed) {
          props.onPlayed(playCallbackInfo);
        }
        startScanning();
      });
      enhancer.current.on("cameraClose", () => {
        if (props.onClosed) {
          props.onClosed();
        }
      });
      enhancer.current.setVideoFit("cover");
      if (props.onInitialized) {
        props.onInitialized(enhancer.current, reader.current);
      }

      toggleCamera();
    };

    if (mounted.current === false) {
      init();
    }
    mounted.current = true;
  }, []);

  const toggleCamera = () => {
    if (mounted.current === true) {
      if (props.isActive === true) {
        enhancer.current?.open(true);
      } else {
        stopScanning();
        enhancer.current?.close();
      }
    }
  };

  React.useEffect(() => {
    toggleCamera();
  }, [props.isActive]);

  const startScanning = () => {
    const decode = async () => {
      if (decoding.current === false && reader.current && enhancer.current) {
        decoding.current = true;
        const results = await reader.current.decode(
          enhancer.current.getFrame()
        );
        if (props.onScanned) {
          props.onScanned(results);
        }
        decoding.current = false;
      }
    };
    if (props.interval) {
      interval.current = setInterval(decode, props.interval);
    } else {
      interval.current = setInterval(decode, 40);
    }
  };

  const stopScanning = () => {
    clearInterval(interval.current);
  };

  return (
    <div
      className={`${
        props.isActive
          ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          : "hidden"
      }`}
    >
      <div ref={container} className="relative bg-black rounded-lg w-4/5 h-4/5">
        <div className="dce-video-container w-full h-full"></div>
        {props.children}
        <button
          onClick={() => {
            props.onClose(); // Close the scanner when button is clicked
            stopScanning();
            enhancer.current?.close();
          }}
          className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
