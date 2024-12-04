import { ProcessCartRequestBody, TimeSeries } from "@/app/types/inventory/api";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import supabase from "../../../../supabase/client";
import twilioClient from "@/lib/twilio/client";
import { TWILIO_ACCOUNT_PHONENUMBER } from "@/lib/twilio/env";

export async function OPTIONS() {
  // Handle preflight OPTIONS request for CORS
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow these methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
    },
  });
}

// Twilio POST Endpoint
export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body = await req.json();
    const { phonenumber } = body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = await twilioClient.messages.create({
      to: phonenumber,
      from: TWILIO_ACCOUNT_PHONENUMBER,
      body: `Your OTP is ${otp}`,
    });

    if (message.status === "failed") {
      return NextResponse.json(
        { error: "Error sending message across" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    return NextResponse.json(
      {
        message: "Sent message",
        condition: message.status,
        otp,
        expiryTime: 10600,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while sending OTP" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

// Cart GET Endpoint
export async function GET(req: Request) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get("storeId");
    const product_barcode_number = searchParams.get("barcodeno");

    if (!store_id || !product_barcode_number) {
      return NextResponse.json(
        { error: "Product barcode and store ID are required" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const storeId = parseInt(store_id, 10);

    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId }, { invItemBarcode: product_barcode_number }],
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Could not find product in store" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    if (product.invItemStock === 0) {
      return NextResponse.json(
        { error: "Product not in stock" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    return NextResponse.json(
      { message: "Item added to cart", product },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error(err);
  }
}

// Cart POST Endpoint
export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body: ProcessCartRequestBody = await req.json();
    const { cartItems, store_id, purchase_time } = body;
    const timestamp = purchase_time ? new Date(purchase_time) : new Date();

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty, cannot process" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const cart_product_ids = cartItems.map((cartItem) => cartItem.product_id);

    const products_inventory = await db.inventory.findMany({
      where: {
        storeId: store_id,
        invId: { in: cart_product_ids },
      },
    });

    if (products_inventory.length === 0) {
      return NextResponse.json(
        { error: "No matching products found in inventory" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const prepped_series_inserts: TimeSeries[] = cartItems.map((cartItem) => {
      const inventoryItem = products_inventory.find(
        (item) => item.invId === cartItem.product_id
      );

      if (!inventoryItem) {
        throw new Error(
          `Product with ID ${cartItem.product_id} not found in inventory, please scan again`
        );
      }

      return {
        mrp_per_bottle: inventoryItem.invItemPrice,
        sales: cartItem.productQuantity,
        sale_amount: cartItem.productQuantity * cartItem.product_price,
        product_id: cartItem.product_id,
        opening_stock: inventoryItem.invItemStock,
        received_stock: 0,
        closing_stock: inventoryItem.invItemStock - cartItem.productQuantity,
        store_id,
        time: timestamp.toISOString(),
      };
    });

    const { error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(prepped_series_inserts);

    if (TimeseriesInsertionError) {
      return NextResponse.json(
        { error: TimeseriesInsertionError.message },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const inventory_updates = cartItems.map((cartItem) =>
      db.inventory.update({
        where: {
          storeId_invId: { storeId: store_id, invId: cartItem.product_id },
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
      { message: "Purchase successful" },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while processing the cart" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
