// context/MarkersContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { MarkerImage, MarkerMap } from '../types';

interface MarkersContextType {
  markers: MarkerMap[];
  markerImages: MarkerImage[]; 
  addMarker: (marker: MarkerMap) => void;
  addMarkerImage: (image: MarkerImage) => void;
  deleteMarker: (marker: MarkerMap) => void;
  deleteMarkerImage: (imageId: string) => void;
  updateMarker: (markerId: string, updates: Partial<MarkerMap>) => void;
}

type MarkersProviderProps = {
  children: ReactNode;
}

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export default function MarkersProvider({ children }: MarkersProviderProps) {
  const [markers, setMarkers] = useState<MarkerMap[]>([
    {
      id: '1',
      latitude: 55.7558,
      longitude: 37.6173,
      title: 'Москва',
      description: 'Столица России',
      createAt: new Date(),
    },
    {
      id: '2',
      latitude: 59.9343,
      longitude: 30.3351,
      title: 'Санкт-Петербург',
      description: 'Северная столица',
      createAt: new Date(),
    },
  ]);

  const [markerImages, setMarkerImages] = useState<MarkerImage[]>([]);

  const addMarker = (marker: MarkerMap) => {
    setMarkers(prev => [...prev, marker]);
  };

  const addMarkerImage = (image: MarkerImage) => {
    setMarkerImages(prev => [...prev, image]);
  };

  const deleteMarker = (marker: MarkerMap) => {
    setMarkers(prev => prev.filter(mark => mark.id !== marker.id))
  }

  const deleteMarkerImage = (imageId: string) => {
    setMarkerImages(prev => prev.filter(img => img.id !== imageId));
  };

  const updateMarker = (markerId: string, updates: Partial<MarkerMap>) => {
    setMarkers(prev => prev.map(marker => 
      marker.id === markerId ? { ...marker, ...updates } : marker
    ));
  };

  return (
    <MarkersContext.Provider value={{ 
      markers, 
      markerImages, 
      addMarker,
      addMarkerImage, 
      deleteMarker,
      deleteMarkerImage,
      updateMarker
    }}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error('useMarkers must be used within MarkersProvider');
  }
  return context;
};