import 'leaflet/dist/leaflet.css';
import { MapFilterPanel } from "@/components/MapFilterPanel";
import DynamicMap from '@/components/DynamicMap';
import { CustomTrigger } from '@/components/CustomTrigger';

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
        <MapFilterPanel />
        <div className='flex-1 h-full'>
          <CustomTrigger/>
          <DynamicMap />
        </div>
    </div>
  );
}
