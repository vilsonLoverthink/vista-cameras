import { NextResponse } from "next/server";
import { cameras } from "@/lib/cameras";

export async function GET() {
  return NextResponse.json(cameras);
}
