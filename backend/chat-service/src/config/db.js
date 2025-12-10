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

    CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY,
        userName TEXT NOT NULL,
        profileImage TEXT,
        status TEXT DEFAULT 'offline'
    );

    CREATE TABLE IF NOT EXISTS blocked_users(
        id TEXT PRIMARY KEY,
        blocker_id TEXT NOT NULL,
        blocked_id TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        UNIQUE(blocker_id,blocked_id)
    );

    CREATE TABLE IF NOT EXISTS friends(
        id TEXT PRIMARY KEY,
        user_a TEXT NOT NULL,
        user_b TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at INTEGER DEFAULT (strftime('%s','now')),
        updated_at INTEGER DEFAULT (strftime('%s','now')),
        UNIQUE(user_a, user_b)
    );
`);

// ========== SEED EXAMPLE DATA FOR TESTING ==========
// These users and friends are sample data for development/testing only
// remove or comment out the entire try-catch block in production
try {
    db.prepare(`INSERT OR IGNORE INTO users (id, userName, profileImage, status) VALUES (?, ?, ?, ?);`).run('1', 'user_A', null, 'offline');
    db.prepare(`INSERT OR IGNORE INTO users (id, userName, profileImage, status) VALUES (?, ?, ?, ?);`).run('2', 'user_B', null, 'offline');
    db.prepare(`INSERT OR IGNORE INTO users (id, userName, profileImage, status) VALUES (?, ?, ?, ?);`).run('3', 'user_C', null, 'offline');
    db.prepare(`INSERT OR IGNORE INTO users (id, userName, profileImage, status) VALUES (?, ?, ?, ?);`).run('4', 'user_D', null, 'online');
    db.prepare(`INSERT OR IGNORE INTO users (id, userName, profileImage, status) VALUES (?, ?, ?, ?);`).run('5', 'user_E', null, 'online');
    
    // ========== EXAMPLE: Conversation between user_A and user_B ==========
    const { nanoid } = await import('nanoid');
    const convoId = nanoid();
    db.prepare(`INSERT OR IGNORE INTO conversations (id, user_a, user_b) VALUES (?, ?, ?);`).run(convoId, '1', '2');
    
    // ========== EXAMPLE: Friend relationships ==========
    const friendId1 = nanoid();
    const friendId2 = nanoid();
    const friendId3 = nanoid();
    const friendId4 = nanoid();
    const friendId5 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, ?);`).run(friendId1, '1', '2', 'accepted');
    db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, ?);`).run(friendId2, '1', '3', 'pending');
    db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, ?);`).run(friendId3, '1', '4', 'accepted');
    db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, ?);`).run(friendId4, '1', '5', 'accepted');
    db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, ?);`).run(friendId5, '2', '3', 'accepted');
    
    // ========== EXAMPLE: Sample messages ==========
    const msgId = nanoid();
    db.prepare(`INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?);`).run(msgId, convoId, '1', 'Hello from user A!');
    
    // add more messages for testing
    const msgId2 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?);`).run(msgId2, convoId, '2', 'Hi user A! How are you?');
    
    // create conversation between user 1 and user 4
    const convoId2 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO conversations (id, user_a, user_b) VALUES (?, ?, ?);`).run(convoId2, '1', '4');
    const msgId3 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?);`).run(msgId3, convoId2, '4', 'Hey, want to play a game?');
    
    // create conversation between user 1 and user 5
    const convoId3 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO conversations (id, user_a, user_b) VALUES (?, ?, ?);`).run(convoId3, '1', '5');
    const msgId4 = nanoid();
    db.prepare(`INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?);`).run(msgId4, convoId3, '1', 'Hello user E!');
} catch (e) {
    // ignore - examples already exist
}
// ========== END SEED EXAMPLE DATA ==========

export default db;