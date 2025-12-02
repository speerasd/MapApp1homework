import * as Location from 'expo-location';

export interface MarkerMap {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
    createAt: string;
    notificationRadius: number;
}

export interface MarkerImage {
    id: number;
    uri: string;
    markerId: number;
    createAt: string;
    width?: number;
    height?: number;
}

export interface MarkerNotification {
  id: number;
  markerId: number;
  notificationId: string;
  shownAt: string;
}

export interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
}

export interface LocationConfig {
  accuracy: Location.LocationAccuracy;
  timeInterval: number;
  distanceInterval: number;
}

// export interface MarkersContextType {
//   markers: MarkerMap[];
//   markerImages: MarkerImage[]; 
//   addMarker: (marker: MarkerMap) => void;
//   addMarkerImage: (image: MarkerImage) => void;
//   deleteMarker: (marker: MarkerMap) => void;
//   deleteMarkerImage: (imageId: string) => void;
//   updateMarker: (markerId: string, updates: Partial<MarkerMap>) => void;
// }

export interface DatabaseContextType {
  addMarker: (marker: Omit<MarkerMap, 'id' | 'createAt'>) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<MarkerMap[]>;
  updateMarker: (id: number, updates: Partial<MarkerMap>) => Promise<void>;

  addMarkerImage: (image: Omit<MarkerImage, 'id' | 'createAt'>) => Promise<number>;
  deleteMarkerImage: (id: number) => Promise<void>;
  getMarkerImages: (id: number) => Promise<MarkerImage[]>;

  isLoading: boolean;
  error: string | null;
  isDBReady: boolean;
  initializeDB: () => Promise<void>
}
