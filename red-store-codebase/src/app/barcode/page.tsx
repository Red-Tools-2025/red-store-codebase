"use client";
import React, { useEffect, useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import useScanner from "../hooks/scanner/StaticHooks/useScanner";

export default function Home() {
  const {
    closeScanner,
    onScanned,
    toggleScanning,
    setInitializedScanner,
    openScanner,
    initializedScanner,
    license,
  } = useScanner();

  console.log({ initializedScanner, license });

  return (
    <>
      <Head>
        <title>Next.js Barcode Scanner</title>
      </Head>
      <main>
        <div className="app">
          <h2>Next.js Barcode Scanner</h2>
          {initializedScanner ? (
            <>
              <Button onClick={toggleScanning} variant="primary">
                {openScanner ? "Stop Scanning" : "Start Scanning"}
              </Button>
            </>
          ) : (
            <div>Initializing...</div>
          )}
          <BarcodeScanner
            license={license}
            onInitialized={() => setInitializedScanner(true)}
            isActive={openScanner}
            onScanned={(results) => onScanned(results)}
            onClose={closeScanner} // Pass onClose function here
          />
        </div>
      </main>
    </>
  );
}
