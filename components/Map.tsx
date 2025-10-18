import { MarkerMap } from "@/types";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { LongPressEvent, Marker, MarkerPressEvent, Region } from "react-native-maps";

type Props = {
    region:Region;
    markers: MarkerMap[];
    onRegionChangeComplete?: (region: Region) => void;
    onLongPress: (event: LongPressEvent) => void;
    onMarkerSelect: (marker: MarkerMap) => void;
}

export default function MapComponent({region, markers, onRegionChangeComplete, onLongPress, onMarkerSelect }: Props) {
    let handleNativeMarkerPress = (event: MarkerPressEvent) => {
        let markerId = event.nativeEvent.id;
        let marker = markers.find(m => m.id === markerId)
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
        <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
            onLongPress={onLongPress}
            onMarkerPress={handleNativeMarkerPress}
        >
        {markers.map(marker => (
            <Marker 
                key={marker.id}
                identifier={marker.id}
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
            />

        ))}
        </MapView>
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
})