import type { Metadata } from "next"

import { AppSidebar } from "@/admin-panel/components/app-sidebar"
import { CategoryEditor } from "@/admin-panel/components/category-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = { title: "Add category | SUOS Admin" }

export default function NewCategoryPage() {
  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><CategoryEditor /></SidebarInset></SidebarProvider></TooltipProvider>
}
