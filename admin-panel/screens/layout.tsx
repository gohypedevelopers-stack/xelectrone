import type { ReactNode } from "react"
import { connection } from "next/server"

import { requireAdmin } from "@/lib/server/dal/auth"
import "@/admin-panel/styles.css"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection()
  await requireAdmin()

  return <div className="admin-panel">{children}</div>
}
