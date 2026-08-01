import type { Metadata } from "next"

import { AppSidebar } from "@/admin-panel/components/app-sidebar"
import { CollectionEditor } from "@/admin-panel/components/collection-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Add collection | SUOS Admin",
  description: "Create a product collection in the SUOS admin dashboard.",
}

export default function AddCollectionPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset><CollectionEditor /></SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
