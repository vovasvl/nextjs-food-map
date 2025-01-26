import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function CustomTrigger() {

  return useSidebar().state == "collapsed" && (<SidebarTrigger className="m-4"/>);
}
