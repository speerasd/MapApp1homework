import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageList from '../../components/ImageList';
import { useMarkers } from '../../context/MarkersContext';
import { MarkerImage, MarkerMap } from '../../types';

export default function MarkerDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [marker, setMarker] = useState<MarkerMap | null>(null)
  const [loading, setLoading] = useState(false)
  const { markers, markerImages, addMarkerImage, deleteMarkerImage } = useMarkers();

  const currentMarkerImages = markerImages.filter(img => img.markerId === id);

  useEffect(() => {
    const foundMarker = markers.find(m => m.id === id);
    setMarker(foundMarker || null);
    
  }, [id, markers])

  const handleAddImage = useCallback(async () => {
    try {
      setLoading(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Разрешите доступ к галереи');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        let newImage: MarkerImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          markerId: id as string,
          createAt: new Date(),
          width: result.assets[0].width,
          height: result.assets[0].height
        };

        addMarkerImage(newImage);
      }
    }
    catch (error) {
      console.error('Ошибка выбора изображения:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при выборе изображения');
    } finally {
      setLoading(false);
    }
  }, [id]);
  const handleDeleteImage = useCallback((imageId: string) => {
    deleteMarkerImage(imageId);
  }, [deleteMarkerImage])
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!marker) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Маркер не найден</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{marker.title}</Text>
          <Text style={styles.description}>{marker.description}</Text>
          <Text style={styles.coordinates}>
            Широта: {marker.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinates}>
            Долгота: {marker.longitude.toFixed(6)}
          </Text>
          <Text style={styles.date}>
            Создан: {new Date(marker.createAt).toLocaleDateString('ru-RU')}
          </Text>
        </View>

        <View style={styles.imagesSection}>
          <ImageList
            images={currentMarkerImages}
            onImageDelete={handleDeleteImage}
            onAddImage={handleAddImage}
            loading={loading}
            emptyText="Нет добавленных изображений для этого маркера"
          />
        </View>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Назад к карте</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBlockColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20
  },
  coordinates: {
    fontSize: 14,
    color: '#888',
    fontFamily:'monospace',
    marginBottom:4
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 8
  },
    imagesSection: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorBox: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
    closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})