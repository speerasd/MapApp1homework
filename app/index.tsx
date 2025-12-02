import { useDatabase } from "@/context/DatabaseContext";
import { MarkerMap } from "@/types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Region } from "react-native-maps";

import MapComponent from "@/components/Map";
import MarkerListComponent from "@/components/MarkerList";

import { useLocationTracking } from '@/hooks/useLocationTracking'; //hook
import { notificationManager } from '@/services/notifications';

export default function Index() {
  const router = useRouter();
  const { addMarker, deleteMarker, updateMarker, getMarkers, isDBReady } = useDatabase();
  const [showList, setShowList] = useState(false);
  const [markers, setMarkers] = useState<MarkerMap[]>([]);
  const [hasCentered, setHasCentered] = useState(false);

  const { location, error } = useLocationTracking();

  let [region, setRegion] = useState<Region>({
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (location && !hasCentered) {
      console.log('Центрируем на локации пользователя');
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setHasCentered(true);
    }
  }, [location, hasCentered]);

  const focusOnUserLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  useEffect(() => {
    if (isDBReady) {
      loadMarkers();
    }
  }, [isDBReady]);

  const loadMarkers = async () => {
    try {
      const markersData = await getMarkers();
      setMarkers(markersData);
    } catch (error) {
      console.error('Ошибка загрузки маркеров:', error);
    }
  };


  const handleLongPress = useCallback((event: any) => {
    let { coordinate } = event.nativeEvent;
    Alert.alert(
      'Добавить маркер',
      'Вы хотите добавить маркер в этом месте?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Добавить',
          onPress: async () => {
            try {
              const newMarkerData = {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                title: `Маркер ${markers.length + 1}`,
                description: `Описание маркера ${markers.length + 1}`,
                notificationRadius: 100,
              };
              
              await addMarker(newMarkerData);
              
              await loadMarkers();
              
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось добавить маркер');
              console.error('Ошибка при добавлении маркера:', error);
            }
          },
        },
      ]
    );
  }, [markers.length, addMarker]);

  const handleMarkerDelete = useCallback((marker: MarkerMap) => {
    Alert.alert(
      'Удалить маркер',
      'Вы уверены, что хотите удалить этот маркер?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationManager.removeNotification(marker.id);

              await deleteMarker(marker.id);
              
              await loadMarkers();
              
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить маркер');
              console.error('Ошибка при удалении маркера:', error);
            }
          },
        },
      ]
    );
  }, [deleteMarker]);
  
  const toggleView = () => {
    setShowList(!showList);
  };

  const handleMarkerPress = useCallback((marker: MarkerMap) => {
    try{
      router.push(`/marker/${marker.id}`)
    }
    catch {
      Alert.alert('Ошибка', 'Не получилось перейти к маркеру');
    }
  }, [router]);

  const handleMarkerEdit = useCallback(async (markerId: number, newTitle: string, newDescription: string) => {
    try {
      await updateMarker(markerId, { title: newTitle, description: newDescription });
      
      await loadMarkers();
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить маркер');
      console.error('Ошибка при обновлении маркера:', error);
    }
  }, [updateMarker]);


  return (
    <View style={styles.container}>
      {!showList ? (
        <MapComponent
          region={region}
          onRegionChangeComplete={setRegion}
          markers={markers}
          onLongPress={handleLongPress}
          onMarkerSelect={handleMarkerPress}
          onFocusLocation={focusOnUserLocation}
        />
      ) : (
        <MarkerListComponent
          markers={markers}
          onMarkerPress={handleMarkerPress}
          onMarkerDelete={handleMarkerDelete}
          onMarkerEdit={handleMarkerEdit}
          emptyText="Нет добавленных маркеров"
        />
      )}
      
      <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
        <Text style={styles.toggleButtonText}>
          {showList ? 'Показать карту' : 'Показать список маркеров'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});