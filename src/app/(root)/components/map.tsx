'use client'
import { useRef } from 'react';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';

function SetViewOnClick({ animate }: { animate: boolean}) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animate,
    });
  });

  return null;
}

export function Map() {
  const mapRef = useRef(null);

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
          <SetViewOnClick animate={true} />
        </MapContainer>
  );
}