'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ClusteredMarkers } from '../ClusteredMarkers';
import { useFilterPanelContext } from '@/contexts/FilterPanelContext';

export function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const { isSidebarOpen } = useFilterPanelContext();
  
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current!.invalidateSize();
      }, 200);
    }
  }, [isSidebarOpen]);

  return (
    <MapContainer style={{ height: '100%', width: '100%', zIndex: '0' }}
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
