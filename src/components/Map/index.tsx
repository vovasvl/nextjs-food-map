'use client';
import { useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ClusteredMarkers } from '../ClusteredMarkers';

export function Map() {
  const mapRef = useRef(null);

  return (
    <MapContainer style={{ height: '100%', width: '100%' }}
      center={[55.75, 37.62]}
      zoom={10}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClusteredMarkers />
    </MapContainer>
  );
}
