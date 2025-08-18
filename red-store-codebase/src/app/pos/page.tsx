"use client";
import { usePos } from "../contexts/pos/PosContext";
import ItemSelectionDisplay from "@/components/feature/pos/feature-components/Displays/ItemSelectionDisplay";
import ProductDisplayControl from "@/components/feature/pos/feature-components/Panels/ProductDisplayControl";
import CartDisplay from "@/components/feature/pos/feature-components/Displays/CartDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import BucketDisplay from "@/components/feature/pos/feature-components/Displays/BucketDisplay";
import { useState, useEffect } from "react";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { Inventory } from "@prisma/client";
import { Cart } from "@/app/types/pos/cart";

const POSPage = () => {
  const {
    selectedStore,
    inventoryItems,
    favoriteProducts,
    isLoading,
    bucketMode,
    setBucketMode,
    buckets,
    fetchError,
    isFetchingBuckets,
    searchTerm,
    setSearchTerm,
    cartItems,
    setCartItems,
  } = usePos();
  // State for favorites
  const [toggleFavorites, setToggleFavorites] = useState<boolean>(false);

  const { clearScannedData } = useBarcodeScanner({
    onScan: (barcode) => {
      setSearchTerm(barcode);
      clearScannedData();
    },
    enabled: !bucketMode, // Only enable scanner when not in bucket mode
  });

  const handleAddToCart = (product: Inventory) => {
    // Logic to add product to cart
    const existingCartItem = cartItems.find(
      (item) => item.product_id === product.invId
    );

    if (existingCartItem) {
      // If item exists, increment quantity
      const updatedCartItems = cartItems.map((item) =>
        item.product_id === product.invId
          ? {
              ...item,
              productQuantity: Math.min(
                item.productQuantity + 1,
                product.invItemStock
              ),
            }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      // If item is new, add to cart with quantity 1
      if (product.invItemStock > 0) {
        const newCartItem: Cart = {
          product_id: product.invId,
          productQuantity: 1,
          productCurrentStock: product.invItemStock,
          productName: product.invItem,
          productBrand: product.invItemBrand || "", // Handle optional brand
          productPrice: product.invItemPrice,
        };
        setCartItems([...cartItems, newCartItem]);
      }
    }
  };

  useEffect(() => {
    if (searchTerm && inventoryItems) {
      const foundProduct = inventoryItems.find(
        (item) => item.invItemBarcode === searchTerm
      );

      if (foundProduct) {
        handleAddToCart(foundProduct);
        setSearchTerm(""); // Clear search term after processing
      }
    }
  }, [searchTerm, inventoryItems, cartItems, setCartItems, setSearchTerm]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="py-3">
        <ProductDisplayControl
          selectedStore={selectedStore}
          bucketMode={bucketMode}
          toggleFavorites={toggleFavorites}
          buckets={buckets}
          setBucketMode={setBucketMode}
          setToggleFavorites={setToggleFavorites}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable Product Grid */}
        <ScrollArea className="flex-1">
          <div className="py-2 pr-4">
            {bucketMode ? (
              <BucketDisplay
                buckets={buckets}
                isFetching={isFetchingBuckets}
                fetchError={fetchError}
              />
            ) : (
              <ItemSelectionDisplay
                inventoryItems={
                  toggleFavorites ? favoriteProducts : inventoryItems
                }
                isLoading={isLoading}
              />
            )}
          </div>
        </ScrollArea>

        {/* Fixed Cart Section */}
        {!bucketMode ? <CartDisplay /> : <></>}
      </div>
    </div>
  );
};

export default POSPage;
