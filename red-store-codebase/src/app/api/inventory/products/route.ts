import { NextRequest, NextResponse } from "next/server";

interface ExtendedNextRequest extends NextRequest {
  message?: string;
}

export async function POST(request: ExtendedNextRequest) {
  // Parse the request body to get the message
  const body = await request.json();
  const message = body.message || "No message";

  // Return a Response object
  return NextResponse.json({
    message: `Hello from Next.js!, some message by you: ${message}`,
  });
}
