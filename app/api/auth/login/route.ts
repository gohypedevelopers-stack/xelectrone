import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/server/controllers/auth.controller";

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await loginUser(email, password);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message.includes("required") || message.includes("Invalid") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
