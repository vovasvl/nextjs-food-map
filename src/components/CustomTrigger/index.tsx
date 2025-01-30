'use client'
import { useFilterPanelContext } from "@/contexts/FilterPanelContext";
import { SidebarTrigger } from "../ui/sidebar";

export function CustomTrigger(){
    const { isSidebarOpen } = useFilterPanelContext();

    return !isSidebarOpen && (
        <SidebarTrigger className={'absolute left-[12px] top-[100px] z-[1] bg-white'}/>
    )
}