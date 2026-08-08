import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as usersController from "@/lib/server/controllers/users.controller";

// GET /api/users
export async function GET() {
  try {
    const users = await usersController.listUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/users (signup)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await usersController.registerUser(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message.includes("already exists") ||
      message.includes("Missing") ||
      message.includes("Password")
        ? 400
        : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
