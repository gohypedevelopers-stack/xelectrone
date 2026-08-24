import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreOtp } from "@/lib/server/auth/otp-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const { otp, phone: cleanPhone } = generateAndStoreOtp(phone);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      // Returned for testing/demo convenience so user immediately knows their OTP
      otp: process.env.NODE_ENV !== "production" ? otp : undefined,
      phone: cleanPhone,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
