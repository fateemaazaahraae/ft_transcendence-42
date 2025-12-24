// import sqlite3 from sqlite3
import Database from 'better-sqlite3';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


// Prefer an explicitly mounted DB at project root (docker-compose mounts ./backend/chat-service/chat.sqlite -> /app/chat.sqlite)
const dockerDbPath = path.join(process.cwd(), "chat.sqlite");
const defaultLocalDb = path.join(process.cwd(), "src", "data", "chat.db");
const dbasePath = process.env.DATABASE_PATH || (fs.existsSync(dockerDbPath) ? dockerDbPath : defaultLocalDb);
const dir = path.dirname(dbasePath);
if(!fs.existsSync(dir)) 
    {
        fs.mkdirSync(dir,{recursive: true});
    }

// initialize database
const db = new Database(dbasePath);


//init tables
console.log('Using database file:', dbasePath);
console.log('📋 Creating tables...');
try {
    db.exec(`
    CREATE TABLE IF NOT EXISTS conversations(
        id TEXT PRIMARY KEY,
        user_a TEXT NOT NULL,
        user_b TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        UNIQUE (user_a, user_b)
    );

    CREATE TABLE IF NOT EXISTS messages(
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now'))
    );

`);
    } catch (e) {
    console.error(' Error creating tables:', e.message);
    process.exit(1);
    }

export default db;