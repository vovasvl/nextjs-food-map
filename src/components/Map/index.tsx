'use client'
import { useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import L from "leaflet";
import { useMapMarkersContext } from '@/contexts/MapMarkersContext';

function SetViewOnClick({ animate }: { animate: boolean }) {
  const map = useMapEvent('click', async (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animate,
    });
  });

  return null;
}

export function Map() {
  const mapRef = useRef(null);
  const { markedRestaurants } = useMapMarkersContext();


  const icon = new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [22, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
        <MapContainer style={{height: "100%", width: "100%" }}
          center={[55.75, 37.62]}
          zoom={10}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ul>
            {markedRestaurants.map((item) => {
              return (
                <li key={item.global_id}>
                  <Marker position={[item.geoData.coordinates[1], item.geoData.coordinates[0]]} icon={icon}/>
                </li>
              );
            })}
          </ul>
          <SetViewOnClick animate={true} />
        </MapContainer>
  );
}