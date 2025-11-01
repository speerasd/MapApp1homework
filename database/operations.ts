import { MarkerImage, MarkerMap } from '@/types';
import * as SQLite from 'expo-sqlite';
import { DatabaseSchema } from './schema';

class DatabaseOperations {
    private db: SQLite.SQLiteDatabase | null = null;

    async initialize(): Promise<void> {
        try {
            this.db = SQLite.openDatabaseSync('markers.db');

            this.db.execSync(DatabaseSchema.tables.markers);
            this.db.execSync(DatabaseSchema.tables.marker_images);
            
            console.log('База проинициализирована');
        }
        catch (error) {
            console.error('Ошибка при инициализации:', error)
            throw error
        }
    }

    private getDatabase(): SQLite.SQLiteDatabase {
        if (!this.db) {
            throw new Error('База данных не инициализировна')
        }
        return this.db;
    }

    async addMarker(marker: Omit<MarkerMap, 'id' | 'createAt'>): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDatabase().runAsync(
                `INSERT INTO markers (latitude, longitude, title, description) VALUES (?, ?, ?, ?)`,
                [marker.latitude, marker.longitude, marker.title, marker.description || null]
            ).then(result => {
                resolve(result.lastInsertRowId as number);
            }).catch(reject);
        });
    }

    async getMarkers(): Promise<MarkerMap[]> {
        return this.getDatabase().getAllAsync<MarkerMap>(
        `SELECT * FROM markers ORDER BY createAt DESC`
        );
    }

    async deleteMarker(id: number): Promise<void> {
        await this.getDatabase().runAsync(
            `DELETE FROM marker_images WHERE marker_id = ?`,
            [id]
        )

        await this.getDatabase().runAsync(
            `DELETE FROM markers WHERE id = ?`,
            [id]
        );
    }

    async updateMarker(id: number, updates: Partial<MarkerMap>) : Promise<void> {
        let fields = [];
        let values = [];

        // if(updates.latitude !== undefined) {
        //     fields.push('latitude = ?');
        //     values.push(updates.latitude);
        // }

        // if(updates.longitude !== undefined) {
        //     fields.push('longitude = ?');
        //     values.push(updates.longitude);
        // }

        if(updates.title !== undefined) {
            fields.push('title = ?');
            values.push(updates.title);
        }

        if(updates.description !== undefined) {
            fields.push('description = ?');
            values.push(updates.description);
        }

        if(fields.length === 0) return;

        values.push(id)

        await this.getDatabase().runAsync(
            `UPDATE markers set ${fields.join(', ')} WHERE id = ?`,
            values
        )
    }

    async addMarkerImage(image: Omit<MarkerImage, 'id' | 'createAt'>): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getDatabase().runAsync(
                `INSERT INTO marker_images (marker_id, uri, width, height) VALUES (?, ?, ?, ?)`,
                [image.markerId, image.uri, image.width || null, image.height || null]
            ).then(result => {
                resolve(result.lastInsertRowId as number);
            }).catch(reject);
        });
    }

    async deleteMarkerImage(id: number): Promise<void> {
        await this.getDatabase().runAsync(
            `DELETE FROM marker_images WHERE id = ?`,
            [id]
        );
    }

    async getMarkerImages(markerId: number): Promise<MarkerImage[]> {
        return this.getDatabase() .getAllAsync<MarkerImage>(
            `SELECT * FROM marker_images WHERE marker_id = ? ORDER BY createAt DESC`,
            [markerId]
        );
    }
}
export const dbOperations = new DatabaseOperations();