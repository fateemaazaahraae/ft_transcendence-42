import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function openDb() {
    const db = await open({
        filename: "./profileDb.sqlite",
        driver: sqlite3.Database,
    });

    await db.exec(
        `CREATE TABLE IF NOT EXISTS profile(
        id TEXT PRIMARY KEY,
        age INTEGER,
        gender TEXT
        )`
    );
    return db;
}