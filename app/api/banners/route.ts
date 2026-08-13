import { NextResponse } from "next/server"
import { listActiveBanners } from "@/lib/server/controllers/banners.controller"

export async function GET() {
  try {
    const banners = await listActiveBanners()
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Failed to list active banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}
