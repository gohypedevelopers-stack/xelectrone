import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { AdminOverview } from "@/components/admin/overview/admin-overview"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getDashboardOverview } from "@/lib/server/controllers/dashboard.controller"

export default async function Page() {
  const overview = await getDashboardOverview()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <AdminOverview data={overview} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

