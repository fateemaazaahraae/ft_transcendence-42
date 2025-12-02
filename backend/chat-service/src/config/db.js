// import sqlite3 from sqlite3
import Database from 'better-sqlite3';

// const Database = require('better-sqlite3')
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbasePath = process.env.dbasePath || path.join(__dirname,'..','data','chat.db');
const dir =path.dirname(dbasePath);
if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive: true});

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