// src/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config';

const CHAT_DB_PATH = process.env.CHAT_DB_PATH || './chat-data.db';

/**
 * Opens and initializes the database connection and schema.
 * @returns {Promise<import('sqlite').Database>} The database instance.
 */
export async function openDb() {
    const db = await open({
        filename: CHAT_DB_PATH,
        driver: sqlite3.Database,
    });
    
    console.log("Initializing Chat database schema...");

    // 1. Contacts Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS contacts (
            user_id TEXT NOT NULL,
            contact_id TEXT NOT NULL,
            PRIMARY KEY (user_id, contact_id)
        );
    `);
    
    // 2. Message Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id TEXT NOT NULL,
            receiver_id TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_read INTEGER DEFAULT 0
        );
    `);

    // 3. BLOCKED USERS TABLE (New Requirement)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS blocked_users (
            blocker_id TEXT NOT NULL,
            blocked_id TEXT NOT NULL,
            blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (blocker_id, blocked_id)
        );
    `);

    console.log("Chat database initialized.");
    
    // --- Sample Data Insertion (IDs: 'user_A', 'user_B', 'user_C') ---
    await db.run(`INSERT OR IGNORE INTO contacts (user_id, contact_id) VALUES (?, ?)`, ['user_A', 'user_B']);
    await db.run(`INSERT OR IGNORE INTO contacts (user_id, contact_id) VALUES (?, ?)`, ['user_B', 'user_A']);
    await db.run(`INSERT OR IGNORE INTO contacts (user_id, contact_id) VALUES (?, ?)`, ['user_A', 'user_C']);
    // Initial Block example
    await db.run(`INSERT OR IGNORE INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)`, ['user_A', 'user_C']);

    return db;
}