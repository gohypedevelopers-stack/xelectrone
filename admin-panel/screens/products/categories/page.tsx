import type { Metadata } from "next"

import { AppSidebar } from "@/admin-panel/components/app-sidebar"
import { CategoryManager } from "@/admin-panel/components/category-manager"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Categories | SUOS Admin",
  description: "Create and manage storefront product categories.",
}

export default function CategoriesPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <CategoryManager />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
