import { openDb } from "../db/db.js"

export async function relationRoutes(fastify) {
    // const db = fastify.db;

    //Send friend request
    fastify.post("/friends/request", { preHandler: fastify.authenticate }, async (req, rep) => {
        const from = req.user.id;
        const { to } = req.body;
        const db = await openDb();

        await db.run(
            `INSERT OR IGNORE INTO friends
            (user_id, friend_id, status, created_at)
            VALUES (?, ?, 'pending', ?)`,
            [from, to, Date.now()]
        );
        return { success: true };
    })

    // accept friend request
    fastify.post("/friends/accept", { preHandler: fastify.authenticate }, async (req) => {
        const me = req.user.id;
        const { from } = req.body;
        const db = await openDb();
        await db.run(
            `UPDATE friends
            SET status = 'accepted'
            WHERE user_id = ? AND friend_id = ?`,
            [from, me]
        );

        await db.run(
            `INSERT OR IGNORE INTO friends
            VALUES (?, ?, 'accepted', ?)`,
            [me, from, Date.now()]
        );
        return { success: true };
    });

    // get friends
    fastify.get("/friends", { preHandler: fastify.authenticate }, async (req) => {
        const db = await openDb();

        const rows = await db.all(
            `SELECT friend_id FROM friends 
            WHERE user_id = ? AND status = 'accepted'`,
            [req.user.id]
        );

        console.log("\n\n----- FRIENDS IN DB -----");
        console.log(rows);
        console.log("------------------------\n\n");

        return rows;
    });


    // block user
    fastify.post("/block", { preHandler: fastify.authenticate }, async (req) => {
        const user_id = req.user.id;
        const { blockedId } = req.body;
        const db = await openDb();
        await db.run(
            `INSERT OR IGNORE INTO blocked_users
            VALUES (?, ?, ?)`,
            [user_id, blockedId, Date.now()]
        );
        await db.run(
            `DELETE FROM friends
            WHERE (user_id = ? AND friend_id = ?)
            OR (user_id = ? AND friend_id = ?)`,
            [user_id, blockedId, blockedId, user_id]
        );
        return { success: true };
    });
}