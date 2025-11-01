
export const DatabaseSchema = {
    version: 1,

    tables: {
        markers:`
            CREATE TABLE IF NOT EXISTS markers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                createAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `,
        marker_images: `
            CREATE TABLE IF NOT EXISTS marker_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uri TEXT NOT NULL,
                marker_id INTEGER NOT NULL,
                createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                width INTEGER,
                height INTEGER
            )
        `
    }
}