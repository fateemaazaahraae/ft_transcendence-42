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
            passwordHash TEXT NOT NULL
            )`
    );

    //2FA table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS user_2fa(
        user_id TEXT,
        code TEXT,
        expire_date INTEGER)`
    );

    //forget-password table
    await db.exec(
    `CREATE TABLE IF NOT EXISTS forget_pass(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        resetToken TEXT NOT NULL,
        resetTokenExpire INTEGER NOT NULL
    )`
  );

    return db;

}
