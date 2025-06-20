import authClient from "@/lib/supabaseAuth/client";
import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

interface LoginRouteRequestType extends NextRequest {
  email: string;
  password: string;
}
export async function POST(req: LoginRouteRequestType, res) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const { data: AuthResponse, error: AuthError } =
      await authClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (AuthError) {
      console.error("Supabase sign-in error:", AuthError);

      // More specific error handling:
      if (AuthError.code === "email_not_confirmed") {
        return NextResponse.json(
          {
            error: "Please confirm your email address to log in.", // User-friendly message
            status: 400, // Or 401, depending on your preference
            code: AuthError.code, // Include the Supabase error code for client-side handling if needed
          },
          { status: 400 }
        );
      } else if (AuthError.message.includes("Invalid email or password")) {
        return NextResponse.json(
          {
            error: "Invalid email or password",
            status: 401,
          },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          {
            error: AuthError.message || "An error occurred during login.", // Generic message
            status: 500,
          },
          { status: 500 }
        );
      }
    }

    console.log(AuthResponse);
    const response = NextResponse.json(
      {
        message: "Logged in",
        user: AuthResponse.user,
        session: AuthResponse.session,
      },
      { status: 200 }
    );

    if (AuthResponse.session?.access_token) {
      response.headers.set(
        "Set-Cookie",
        serialize("supabase-access-token", AuthResponse.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      );
    }

    return response;
  } catch (err) {
    // response when internet correction weak, or error during dev
    console.error("Error during login:", err); // Log the overall error
    console.log("Love all");
    return NextResponse.json(
      {
        error: "An error occurred during login. Please try again.", // User-friendly message
        status: 500,
      },
      { status: 500 }
    );
  }
}
