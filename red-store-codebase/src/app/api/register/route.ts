import dbClient from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface RegisterRouteRequestType extends NextRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {}
