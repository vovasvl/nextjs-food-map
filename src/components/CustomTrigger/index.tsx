'use client'
import { useFilterPanelContext } from "@/contexts/FilterPanelContext";
import { SidebarTrigger } from "../ui/sidebar";
import CustomIcon from '../../../public/chevrons-right.svg'

export function CustomTrigger(){
    const { isSidebarOpen } = useFilterPanelContext();

    return !isSidebarOpen && (
        <SidebarTrigger className={'absolute left-0 top-[100px] z-[1] w-[48px] h-[48px] rounded-s-none rounded-e-[12px] shadow-[0_1px_6px_2px_rgba(0,0,0,0.2)] bg-white'}>
            <CustomIcon className="w-[24px] h-[24px]"/>
        </SidebarTrigger>
    )
}