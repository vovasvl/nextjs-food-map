import 'leaflet/dist/leaflet.css';
import { MapSidebar } from "./components/map-sidebar";
import { Map } from "./components/map";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
        <MapSidebar />
        <div className='flex-1 h-full'>
          <Map />
        </div>
    </div>
  );
}
