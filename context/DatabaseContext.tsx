import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { dbOperations } from '../database/operations';
import { DatabaseContextType, MarkerImage, MarkerMap } from '../types';

type DatabaseProviderProps = {
  children: ReactNode;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export default function MarkersProvider({ children }: DatabaseProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await dbOperations.initialize();
      setIsDBReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при инициализации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDBOperation = async <T,>(operation: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);
      return await operation();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Database error';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const addMarker = (marker: Omit<MarkerMap, 'id' | 'createAt'>) => 
    handleDBOperation(() => dbOperations.addMarker(marker));

  const getMarkers = () => 
    handleDBOperation(() => dbOperations.getMarkers());

  const deleteMarker = (id: number) => 
    handleDBOperation(() => dbOperations.deleteMarker(id));

  const updateMarker = (id: number, updates: Partial<MarkerMap>) => 
    handleDBOperation(() => dbOperations.updateMarker(id, updates));

  const addMarkerImage = (image: Omit<MarkerImage, 'id' | 'createAt'>) => 
    handleDBOperation(() => dbOperations.addMarkerImage(image));

  const deleteMarkerImage = (id: number) => 
    handleDBOperation(() => dbOperations.deleteMarkerImage(id));

  const getMarkerImages = (markerId: number) => 
    handleDBOperation(() => dbOperations.getMarkerImages(markerId));

  const value: DatabaseContextType = {
    addMarker,
    deleteMarker,
    getMarkers,
    updateMarker,
    addMarkerImage,
    deleteMarkerImage,
    getMarkerImages: getMarkerImages,
    isLoading,
    error,
    isDBReady,
    initializeDB
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase не может быть использована без DatabaseProvider');
  }
  return context;
};