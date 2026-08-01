import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { AdminOverview } from "@/components/admin/overview/admin-overview"
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

