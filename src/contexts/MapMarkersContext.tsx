'use client'
import { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant } from '@/types';

interface MapMarkersContextProps {
  markedRestaurants: Restaurant[];
  setMarkedRestaurants: (restaurants: Restaurant[]) => void;
}

const MapMarkersContext = createContext<MapMarkersContextProps | undefined>(undefined);

export function MapMarkersProvider({ children }: { children: ReactNode })  {
  const [markedRestaurants, setMarkedRestaurants] = useState<Restaurant[]>([]);
  return (
    <MapMarkersContext.Provider value={{ markedRestaurants, setMarkedRestaurants }}>
      {children}
    </MapMarkersContext.Provider>
  );
};

export const useMapMarkersContext = () => {
  const context = useContext(MapMarkersContext);
  if (!context) {
    throw new Error('useMapMarkersContext must be used within a MapMarkersProvider');
  }
  return context;
};
