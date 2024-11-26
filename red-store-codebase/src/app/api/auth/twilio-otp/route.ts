import twilioClient from "@/lib/twilio/client";
import { TWILIO_ACCOUNT_PHONENUMBER } from "@/lib/twilio/env";
import { NextResponse } from "next/server";

interface ReqBod {
  phonenumber: string;
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

    if (message.status === "failed")
      return NextResponse.json(
        { error: "Error sending message across" },
        { status: 404 }
      );

    // Move otp gens to Redis, with a TTL for more security and to prevent MIM attacks
    return NextResponse.json(
      {
        message: "Sent message",
        condition: message.status,
        otp: otp,
        expiryTime: 3600,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
  }
}
