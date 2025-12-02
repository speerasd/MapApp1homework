import { LocationConfig } from '@/types';
import * as Location from 'expo-location';

export class LocationService {
    static defaultConfig: LocationConfig = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 2000,
        distanceInterval: 5,
    };

    static async requestForegroundPermissions(): Promise<boolean> {
        try {
        const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting foreground permissions:', error);
        return false;
        }
    }

    static async startWatching(onLocation: (location: Location.LocationObject) => void, config: LocationConfig = this.defaultConfig): Promise<Location.LocationSubscription> {
        const hasPermission = await this.requestForegroundPermissions();
        if (!hasPermission) {
            throw new Error('Доступ к местоположению не разрешен');
        }

        return await Location.watchPositionAsync({
            accuracy: config.accuracy,
            timeInterval: config.timeInterval,
            distanceInterval: config.distanceInterval,
        }, onLocation)
    }

    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000;
        
        return distance;
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}