import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./Sidebar";
import { ModeToggle } from "../mode-toggle";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-1 flex-col h-screen overflow-hidden">
            {/* Fixed Top Bar — never scrolls */}
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-card px-4 sm:h-[60px] sm:px-6 z-30">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                <Separator orientation="vertical" className="h-5" />
                <span className="text-sm font-medium text-foreground/70 hidden sm:inline-flex">Overview</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground">
                  <Bell className="h-4 w-4" />
                </Button>
                <ModeToggle />
              </div>
            </header>

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8 lg:px-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
