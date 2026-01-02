import sqlite3 from "sqlite3"
import { open } from "sqlite"

let dbInstance = null;

async function getDb() {
    if (dbInstance) {
        return dbInstance;
    }

    const db = await open({
        filename: './game_data.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS matches (
            id TEXT PRIMARY KEY,
            player1Id TEXT NOT NULL,
            player2Id TEXT NOT NULL,
            score1 INTEGER NOT NULL,
            score2 INTEGER NOT NULL,
            winnerId TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS wlxp (
            id TEXT PRIMARY KEY,
            XPoints INTEGER DEFAULT 0,
            Wins INTEGER DEFAULT 0,
            Losses INTEGER DEFAULT 0
        )
    `);
        // db created.
    dbInstance = db;
    return db;
}

export { getDb };