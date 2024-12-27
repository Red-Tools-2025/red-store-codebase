import twilioClient from "@/lib/twilio/client";
import { TWILIO_ACCOUNT_PHONENUMBER } from "@/lib/twilio/env";
import { NextResponse } from "next/server";

interface ReqBod {
  phonenumber: string;
}

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

export async function POST(req: Request) {
  try {
    const body: ReqBod = await req.json();
    const { phonenumber } = body;

    // Generate a random 6-digit OTP
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
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Return the OTP response
    return NextResponse.json(
      {
        message: "Sent message",
        condition: message.status,
        otp: otp,
        expiryTime: 10600, // Add expiry time for OTP
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while sending OTP" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
