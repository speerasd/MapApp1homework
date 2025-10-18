import { useMarkers } from "@/context/MarkersContext";
import { MarkerMap } from "@/types";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Region } from "react-native-maps";

import MapComponent from "@/components/Map";
import MarkerListComponent from "@/components/MarkerList";

export default function Index() {
  const router = useRouter();
  const { markers, addMarker, deleteMarker, updateMarker } = useMarkers();
  const [showList, setShowList] = useState(false);

  let [region, setRegion] = useState<Region>({
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });


  const handleLongPress = useCallback((event:any) => {
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
          onPress: () => {
            const newMarker: MarkerMap = {
              id: Date.now().toString(),
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              title: `Маркер ${markers.length + 1}`,
              description: `Описание маркера ${markers.length + 1}`,
              createAt: new Date(),
            };
            addMarker(newMarker);
          },
        },
      ]
    );
  },[markers.length]);

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
          onPress: () => deleteMarker(marker),
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

  const handleMarkerEdit = useCallback((markerId: string, newTitle: string, newDescription: string) => {
    updateMarker(markerId, { title: newTitle, description: newDescription });
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