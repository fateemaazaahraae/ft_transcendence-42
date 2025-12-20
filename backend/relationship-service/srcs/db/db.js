import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function openDb() {
    const db = await open({
        filename: "./relation.sqlite",
        driver: sqlite3.Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS friends(
        user_id TEXT NOT NULL,
        friend_id TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) NOT NULL,
        created_at INTEGER,
        PRIMARY KEY (user_id, friend_id)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS blocked_users(
        user_id TEXT NOT NULL,
        blocked_user_id TEXT NOT NULL,
        created_at INTEGER,
        PRIMARY KEY (user_id, blocked_user_id)
        );
    `);
    return db
}