export interface MarkerMap {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    createAt: Date;
}

export interface MarkerImage {
    id: string;
    uri: string;
    markerId: string;
    createAt: Date;
    width?: number;
    height?: number;
}

export interface MarkersContextType {
  markers: MarkerMap[];
  markerImages: MarkerImage[]; 
  addMarker: (marker: MarkerMap) => void;
  addMarkerImage: (image: MarkerImage) => void;
  deleteMarker: (marker: MarkerMap) => void;
  deleteMarkerImage: (imageId: string) => void;
  updateMarker: (markerId: string, updates: Partial<MarkerMap>) => void;
}
