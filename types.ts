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

export type RootStackParamList = {
    index: undefined;
    marker: { id: string }
}

export type ImagePickerError = {
    code: string;
    message: string;
    domain?: string;
}

export type MapError = {
    message: string;
    type: 'loading' | 'permission' | 'unknown'; 
}