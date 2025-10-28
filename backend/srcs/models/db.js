import sqlite3 from "sqlite3"
import {open} from "sqlite"

export async function openDb(){

    const db = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
    
    await db.exec(
        `CREATE TABLE IF NOT EXISTS users(
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            userName TEXT NOT NULL,
            email TEXT NOT NULL,
            passwordHash TEXT NOT NULL)`
    );

    return db;

}
