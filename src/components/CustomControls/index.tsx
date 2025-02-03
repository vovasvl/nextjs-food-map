'use client'

import { RefObject } from "react";
import { Map } from 'leaflet';
import { Button } from "../ui/button";
import ZoomInIcon from '../../../public/plus.svg'
import ZoomOutIcon from '../../../public/minus.svg'

export function CustomControls( { mapRef }: { mapRef: RefObject<Map | null> }){
    const zoomIn = () => {
        const map = mapRef.current;
        if (map) {
            map.setZoom(map.getZoom() + 1);
        }
    }
    const zoomOut = () => {
        const map = mapRef.current;
        if (map) {
            map.setZoom(map.getZoom() - 1);
        }
    }
    return  (
        <div className="absolute right-2 bottom-1/2 translate-y-1/2 z-[1125] flex flex-col rounded-t-[12px] rounded-b-[12px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.2)]">
            <Button
                variant="ghost"
                className={"w-[40px] h-[40px] p-0 rounded-t-[12px] rounded-b-none bg-white"}
                onClick={zoomIn}
            >
                <ZoomInIcon className="w-[24px] h-[24px]"/>
            </Button>
            <Button
                variant="ghost"
                className={"w-[40px] h-[40px] p-0 rounded-t-none rounded-b-[12px] bg-white"}
                onClick={zoomOut}
            >
                <ZoomOutIcon className="w-[24px] h-[24px]"/>
            </Button>
        </div>
    )
}