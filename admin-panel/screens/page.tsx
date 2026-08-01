import { AppSidebar } from "@/admin-panel/components/app-sidebar"
import { AdminOverview } from "@/admin-panel/components/AdminOverview"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <AdminOverview />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
