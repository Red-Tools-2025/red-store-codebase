import { ProcessCartRequestBody } from "@/app/types/inventory/api";
import {
  TimeSeries,
  TimeSeriesUpdateFunctionArgumentType,
  TimeSeriesUpdateFuntionReturnType,
} from "@/app/types/inventory/api";

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import supabase from "../../../../supabase/client";

// fetches product for cart
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const store_id = searchParams.get("storeId");
    const product_barcode_number = searchParams.get("barcodeno");

    if (!store_id || !product_barcode_number)
      return NextResponse.json(
        { error: "product barcode and store id are required" },
        { status: 404 }
      );

    // Convert storeId and productbarcodes to a number
    const storeId = parseInt(store_id, 10);
    const itemBarcode = parseInt(product_barcode_number, 10);

    const product = await db.inventory.findFirst({
      where: {
        AND: [{ storeId: storeId }, { invItemBarcode: itemBarcode }],
      },
    });

    // check if product even exists
    if (!product)
      return NextResponse.json(
        { error: "Could not find product in store" },
        { status: 404 }
      );

    // check product stock levels
    if (product.invItemStock === 0)
      return NextResponse.json(
        { error: "Product not in stock" },
        { status: 404 }
      );

    return NextResponse.json(
      {
        message: "Item added to cart",
        product,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
  }
}

// endpoint to process cart items
export async function POST(req: Request) {
  try {
    const body: ProcessCartRequestBody = await req.json();
    const { cartItems, purchase_time } = body;
    const timestamp = purchase_time ? new Date(purchase_time) : new Date();

    if (cartItems.length === 0)
      return NextResponse.json(
        { error: "Cart is empty, cannot process" },
        { status: 400 }
      );

    const prepped_series_inserts: TimeSeries[] = cartItems.map(
      ({
        productQuantity,
        product_id,
        product_price,
        store_id,
        product_current_stock,
      }) => ({
        mrp_per_bottle: product_price,
        sales: productQuantity,
        sale_amount: productQuantity * product_price,
        product_id: product_id,
        opening_stock: product_current_stock,
        received_stock: 0,
        closing_stock: product_current_stock + 0 - productQuantity,
        store_id: store_id,
        time: timestamp.toISOString(),
      })
    );

    const { data, error: TimeseriesInsertionError } = await supabase
      .from("inventory_timeseries")
      .insert(prepped_series_inserts);

    if (TimeseriesInsertionError)
      return NextResponse.json(
        { error: TimeseriesInsertionError.message },
        { status: 400 }
      );
  } catch (err) {
    console.log(err);
  }
}
