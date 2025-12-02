import { useDatabase } from '@/context/DatabaseContext';
import { LocationService } from '@/services/location';
import { notificationManager } from '@/services/notifications';
import { LocationState, MarkerMap } from '@/types';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useLocationTracking = () => {
    const [locationState, setLocationState] = useState<LocationState>({
        location: null,
        errorMsg: null,
    });

    const [markers, setMarkers] = useState<MarkerMap[]>([]);
    const locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const lastLocationUpdate = useRef<number>(0);

    const notificationManagerRef = useRef(notificationManager)

    const { getMarkers } = useDatabase();

    const loadMarkers = useCallback(async() => {
        try { 
            const loadedMarkers = await getMarkers();
            setMarkers(loadedMarkers);
        }
        catch(error) {
            console.log('Ошибка загрузки меток:', error);
        }
    }, [getMarkers])

    const checkProximityToMarkers = useCallback(async (location: Location.LocationObject) => {
        const { latitude, longitude } = location.coords;
        const nm = notificationManagerRef.current;
        for (const marker of markers) {
            const distance = LocationService.calculateDistance(
                latitude,
                longitude,
                marker.latitude,
                marker.longitude
            )
            if(distance > marker.notificationRadius && nm.hasActiveNotification(marker.id)) {
                await nm.removeNotification(marker.id);
            }

            if(distance <= marker.notificationRadius && !nm.hasActiveNotification(marker.id)) {
                await nm.showNotification(marker);
            }
        }
    }, [markers]);

    const startLocationTracking = useCallback(async () => {
        try {
            await LocationService.requestForegroundPermissions();
            await notificationManagerRef.current.requestPermissions();
            await loadMarkers();
            locationSubscription.current = await LocationService.startWatching(
                (location) => {
                    const now = Date.now();
                    setLocationState({ location, errorMsg: null});
                    if (now - lastLocationUpdate.current > 2000) {
                        checkProximityToMarkers(location)
                        lastLocationUpdate.current = now;
                    }
                }
            )
        }
        catch (error) {
            setLocationState(prev => ({
                ...prev,
                errorMsg: error instanceof Error ? error.message : 'Неизвестная ошибка'
            }));
        }
    }, [checkProximityToMarkers]);

    const stopLocationTracking = useCallback(() => {
        if (locationSubscription.current) {
            locationSubscription.current.remove();
            locationSubscription.current = null;
        }
        //notificationManagerRef.current.clearAllNotifications();
    }, []);

    useEffect(() => {
        startLocationTracking();

        return () => {
            stopLocationTracking();
        };
    }, [startLocationTracking, stopLocationTracking]);

    return {
        location: locationState.location,
        error: locationState.errorMsg,                
    };
};
