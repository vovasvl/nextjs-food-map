'use client'
import { CustomTrigger } from "@/components/ui/custom-trigger";
import { MapSidebar } from "./components/map-sidebar";

export default function Home() {
  return (
    <div className="flex">
        <MapSidebar />
        <div>
          <CustomTrigger />
        </div>
    </div>
  );
}
