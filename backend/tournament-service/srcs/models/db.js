import sqlite3 from "sqlite3"
import {open} from "sqlite"

export async function openDb() {
    
    const db = await open({
        filename: "./tournament_data.sqlite",
        driver: sqlite3.Database,
    });
    
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tournaments(
        id TEXT PRIMARY KEY,
        tournamentName TEXT NOT NULL,
        nickName TEXT NOT NULL,
        image TEXT NOT NULL
        )`
    );
    return db; 
}