import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { ensureDefaultBannersSeeded, listBanners } from "@/lib/server/controllers/banners.controller"

export async function POST() {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await ensureDefaultBannersSeeded()
  const banners = await listBanners()
  return NextResponse.json(banners)
}
