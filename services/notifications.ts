import { MarkerMap } from '@/types';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldPlaySound: true,     
    shouldSetBadge: true,      
    shouldShowList: true,       
  }),
});

export class NotificationManager {
    private activeNotifications: Map<number, { id: string; timestamp: number }> = new Map();

    async requestPermissions(): Promise<void> {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Разрешение не получено');
        }
    }

    async showNotification(marker: MarkerMap): Promise<void> {
        if (this.hasActiveNotification(marker.id)) {
            return;
        }
        
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Вы находитесь около метки",
                body: `Вы находитесь около метки "${marker.title}"`,
                data: {markerId:marker.id},
            },
            trigger: null,
        });
        
        this.activeNotifications.set(marker.id, {
            id: notificationId,
            timestamp: Date.now()
        });
    }

    async removeNotification(markerId: number): Promise<void> {
        const notificationId = this.activeNotifications.get(markerId);
        if (notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(notificationId.id);
                await Notifications.dismissNotificationAsync(notificationId.id);
                this.activeNotifications.delete(markerId);
            } catch (error) {
                console.log(error)
            }
        }
    };

    hasActiveNotification(markerId: number): boolean {
        const notification = this.activeNotifications.get(markerId);
        if (!notification) {
            return false;
        }
        
        const Time = 5 * 60 * 1000;
        const isExpired = Date.now() - notification.timestamp > Time;
        if (isExpired) {
            this.activeNotifications.delete(markerId);
            return false;
        }
        
        return true;
    }

    clearAllNotifications(): void {
        this.activeNotifications.clear();
    }
}

export const notificationManager = new NotificationManager();