import { NextResponse } from "next/server";
import { fetchDelhiveryWaybill, getDelhiveryTrackingUrl } from "@/lib/server/delhivery";

export async function GET() {
  try {
    const awb = await fetchDelhiveryWaybill();
    const trackingUrl = getDelhiveryTrackingUrl(awb);
    return NextResponse.json({ success: true, awb, trackingUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch waybill";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
