'use client'
import { useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import L from "leaflet";
import { Restaurant } from '@/types';
import { fetchRestaurants } from '@/lib/fetchRestaurants';

function SetViewOnClick({ animate, setRestaurants }: { animate: boolean, setRestaurants: (restaurants: Restaurant[]) => void}) {
  const map = useMapEvent('click', async (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animate,
    });

    try{
    const response = await fetchRestaurants({OperatingCompany: 'Хлеб', TypeObject: 'кафе'});
    setRestaurants(response);
    } catch(error) {
      if(error instanceof Error){
        console.log(error.message);
      }
    }
  });

  return null;
}

export function Map() {
  const mapRef = useRef(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

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
            {restaurants.map((item) => {
              return (
                <li key={item.global_id}>
                  <Marker position={[item.geoData.coordinates[1], item.geoData.coordinates[0]]} icon={icon}/>
                </li>
              );
            })}
          </ul>
          <SetViewOnClick animate={true} setRestaurants={setRestaurants}/>
        </MapContainer>
  );
}