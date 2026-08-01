import type { Metadata } from "next"

import { BuyXGetYEditor } from "@/components/admin/discounts/buy-x-get-y-editor"
import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Create Buy X get Y discount | SUOS Admin",
  description: "Create a Buy X get Y discount for SUOS.",
}

export default function BuyXGetYPage() {
  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><BuyXGetYEditor /></SidebarInset></SidebarProvider></TooltipProvider>
}

