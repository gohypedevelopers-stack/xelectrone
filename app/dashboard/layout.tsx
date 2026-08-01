import type { ReactNode } from "react"
import { connection } from "next/server"

import { requireAdmin } from "@/lib/server/dal/auth"
import "./dashboard.css"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection()
  await requireAdmin()

  return <div className="dashboard-shell">{children}</div>
}
