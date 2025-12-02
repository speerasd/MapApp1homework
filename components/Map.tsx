import { MarkerMap } from "@/types";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { LongPressEvent, Marker, MarkerPressEvent, Region } from "react-native-maps";


type Props = {
    region:Region;
    markers: MarkerMap[];
    onRegionChangeComplete?: (region: Region) => void;
    onLongPress: (event: LongPressEvent) => void;
    onMarkerSelect: (marker: MarkerMap) => void;
    onFocusLocation?: () => void;
}

export default function MapComponent({region, markers, onRegionChangeComplete, onLongPress, onMarkerSelect, onFocusLocation }: Props) {

    let handleNativeMarkerPress = (event: MarkerPressEvent) => {
        let markerId = event.nativeEvent.id;
        let marker = markers.find(m => m.id.toString() === markerId)
        if (marker) {
            onMarkerSelect(marker)
        }
    };

    if (Platform.OS === 'web') {
        return (
        <View style={styles.webContainer}>
            <Text style={styles.webText}>🗺️ Карта недоступна в веб-версии</Text>
            <Text>Используйте приложение Expo Go на телефоне</Text>
        </View>
        );
    }
    return (
        <View style={styles.container}>
        <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
            onLongPress={onLongPress}
            onMarkerPress={handleNativeMarkerPress}
            showsUserLocation={true}
            showsMyLocationButton={false}
        >
        {markers.map(marker => (
            <Marker 
                key={marker.id}
                identifier={marker.id.toString()}
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
            />

        ))}
        </MapView>

        {onFocusLocation && (
            <TouchableOpacity 
                style={styles.locationButton}
                onPress={onFocusLocation}
            >
                <Text style={styles.locationButtonText}>Мое местоположение</Text>
            </TouchableOpacity>
        )}
        </View>
    )

}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    webContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    webText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    
    locationButton: {
        position: 'absolute',
        top: 5,
        left: 10,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    locationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
})