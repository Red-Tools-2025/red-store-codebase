import { ProcessCartRequestBody, TimeSeries } from "@/app/types/inventory/api";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import supabase from "../../../../supabase/client";

export async function OPTIONS() {
  // Handle preflight OPTIONS request for CORS
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow specific headers
      },
    }
  );
}

// fetches product for cart
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get("storeId");
    const product_barcode_number = searchParams.get("barcodeno");

    if (!store_id || !product_barcode_number)
      return NextResponse.json(
        { error: "product barcode and store id are required" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    // Convert storeId and productbarcodes to a number
    const storeId = parseInt(store_id, 10);

    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId: storeId }, { invItemBarcode: product_barcode_number }],
      },
    });

    // check if product even exists
    if (!product)
      return NextResponse.json(
        { error: "Could not find product in store" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    // check product stock levels
    if (product.invItemStock === 0)
      return NextResponse.json(
        { error: "Product not in stock" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    return NextResponse.json(
      {
        message: "Item added to cart",
        product,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// endpoint to process cart items
export async function POST(req: Request) {
  try {
    const body: ProcessCartRequestBody = await req.json();
    const { cartItems, store_id, purchase_time } = body;
    const timestamp = purchase_time ? new Date(purchase_time) : new Date();

    if (cartItems.length === 0)
      return NextResponse.json(
        { error: "Cart is empty, cannot process" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    const cart_product_ids = cartItems.map((cartItem) => cartItem.product_id);

    // no health check done, handled in scan api
    const products_inventory = await db.inventory.findMany({
      where: {
        storeId: store_id,
        invId: { in: cart_product_ids },
      },
    });

    if (products_inventory.length === 0)
      return NextResponse.json(
        { error: "No matching products found in inventory" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    console.log({ cartItems });

    const prepped_series_inserts: TimeSeries[] = cartItems.map((cartItem) => {
      const inventoryItem = products_inventory.find(
        (item) => item.invId === cartItem.product_id
      );

      if (!inventoryItem)
        throw new Error(
          `Product with ID ${cartItem.product_id} not found in inventory, please scan again`
        );

      console.log({
        calculations: {
          closing: inventoryItem.invItemStock - cartItem.productQuantity,
          sales: cartItem.productQuantity,
        },
      });

      // Corrected to match API body keys
      const productQuantity = cartItem.productQuantity; // Fix here
      const productPrice = cartItem.product_price; // Fix here

      return {
        mrp_per_bottle: inventoryItem.invItemPrice,
        sales: cartItem.productQuantity,
        sale_amount: cartItem.productQuantity * productPrice,
        product_id: cartItem.product_id,
        product_name: inventoryItem.invItem, // Added product_name
        opening_stock: inventoryItem.invItemStock,
        received_stock: 0,
        closing_stock: inventoryItem.invItemStock - productQuantity,
        store_id: store_id,
        time: timestamp.toISOString(),
      };
    });

    const { data, error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(prepped_series_inserts);

    if (TimeseriesInsertionError)
      return NextResponse.json(
        { error: TimeseriesInsertionError.message },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

    // given we pass error gaurd clause i update my inventory as well
    const inventory_updates = cartItems.map((cartItem) =>
      db.inventory.update({
        where: {
          storeId_invId: { storeId: store_id, invId: cartItem.product_id }, // utilizing the primary key
        },
        data: {
          invItemStock: {
            decrement: cartItem.productQuantity,
          },
        },
      })
    );

    await db.$transaction(inventory_updates);

    return NextResponse.json(
      { message: "Purchase successfull" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}
