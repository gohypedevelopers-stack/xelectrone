import type { Metadata } from "next"

import { FreeShippingEditor } from "@/components/admin/discounts/basic-discount-editor"
import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = { title: "Create free-shipping discount | SUOS Admin", description: "Create a free-shipping discount for SUOS." }

export default function FreeShippingPage() {
  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><FreeShippingEditor /></SidebarInset></SidebarProvider></TooltipProvider>
}

