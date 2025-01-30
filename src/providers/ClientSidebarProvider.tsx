'use client';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useFilterPanelContext } from "@/contexts/FilterPanelContext";

export function ClientSidebarProvider({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar } = useFilterPanelContext();

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={toggleSidebar}>
      {children}
    </SidebarProvider>
  );
}