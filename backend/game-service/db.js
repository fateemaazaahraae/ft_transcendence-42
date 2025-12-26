const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

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
        // db created.
    dbInstance = db;
    return db;
}
module.exports = {getDb};