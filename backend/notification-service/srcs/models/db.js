import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function openDb() {
    const db = await open({
        filename: "./notifications.sqlite",
        driver: sqlite3.Database,
    });

    await db.exec(
        `CREATE TABLE IF NOT EXISTS notifications(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        payload TEXT,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    );
    return db;
}