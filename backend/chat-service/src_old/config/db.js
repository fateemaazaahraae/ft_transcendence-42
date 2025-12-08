// import sqlite3 from sqlite3
import Database from 'better-sqlite3';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const dbasePath = process.env.DATABASE_PATH || path.join(process.cwd(),"src","data","chat.db");
const dir =path.dirname(dbasePath);
if(!fs.existsSync(dir)) 
    {
        fs.mkdirSync(dir,{recursive: true});
    }
const db = new Database(dbasePath);

//init tables

db.exec(
    `

    CREATE TABLE IF NOT EXISTS conversations(
    id TEXT PRIMARY KEY ,
    user_a TEXT NOT NULL,
    user_b TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    UNIQUE (user-a,user_b)
    );

    CREATE TABLE IF NOT EXISTS messages(
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s','now')),

    );

    CREATE TABLE IF NOT EXISTS blocked_users(
    id TEXT PRIMARY KEY,
    blocker_id TEXT NOT NULL,
    blocked_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    UNIQUE(blocker_id,blocked_id)
    );
    `
);
MediaSourceHandle.exports = db;