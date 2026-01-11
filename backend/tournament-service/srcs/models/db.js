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
        players INTEGER
        )`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Trmatches (
            id TEXT PRIMATY KEY,
            player1Id TEXT NOT NULL,
            player2Id TEXT NOT NULL,
            score1 INTEGER NOT NULL,
            score2 INTEGER NOT NULL,
            winnerId TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )`
    )

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Trwlxp(
            id TEXT PRIMARY KEY,
            XPoints INTEGER DEFAULT 0,
            Wins INTEGER DEFAULT 0,
            Losses INTEGER DEFAULT 0
        )`
    );
    return db; 
}