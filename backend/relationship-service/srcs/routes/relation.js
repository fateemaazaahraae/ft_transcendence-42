import { openDb } from "../db/db.js"

export async function relationRoutes(fastify) {

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

    // unblock user
    fastify.post("/unblock", { preHandler: fastify.authenticate }, async (req) => {
        const me = req.user.id;
        const { blockedId } = req.body;
        const db = await openDb();
        await db.run(
            `DELETE FROM blocked_users
            WHERE (user_id = ? AND blocked_user_id = ?)
            OR (user_id = ? AND blocked_user_id = ?)`,
            [me, blockedId, blockedId, me]
        )
        console.log("--------")
        console.log("heeereee")
        console.log("--------")
        return { success: true };
    });

    // cancel friendship request
    fastify.post("/friends/cancel", { preHandler: fastify.authenticate }, async(req) => {
        const me = req.user.id;
        const { request_id } = req.body;
        const db = await openDb();
        await db.run(
            `DELETE FROM friends
            WHERE (user_id = ? AND friend_id = ?)
            OR (user_id = ? AND friend_id = ?)`,
            [me, request_id, request_id, me]
        );
        return { success: true }
    });

    // get status between 2 users
    fastify.get("/friends/status/:id", { preHandler: fastify.authenticate }, async(req) => {
        const me = req.user.id;
        const other = req.params.id;
        const db = await openDb();
        
        if (me === other) return { status: "self" };
        
        const isBlocked = await db.get(
            `SELECT 1 FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?`,
            [me, other]
        );
        if (isBlocked) return { status: "blocked" };
        
        const relation = await db.get(
            `SELECT user_id, friend_id, status
            FROM friends
            WHERE user_id = ? AND friend_id = ?
                OR user_id = ? AND friend_id = ?`,
            [me, other, other, me]
        );

        if (!relation) return { status: "none" };
        if (relation.status === "accepted") return { status: "friend" };
        if (relation.status === "pending") {
            if (relation.user_id === me)
                return { status: "pending_sent" };
            else
                return { status: "pending_received" };
        }
        return { status: "none" };
    });

    // get invitaions
    fastify.get("/invitations", { preHandler: fastify.authenticate }, async(req) => {
        const me = req.user.id;
        const db = await openDb();
        const invit = await db.all(
            `SELECT user_id AS sender_id, created_at
            FROM friends
            WHERE friend_id = ? AND status = 'pending'`,
            [me]
        );
        return invit;
    });

    // get blocked
    fastify.get("/blocked", { preHandler: fastify.authenticate }, async(req) => {
        const me = req.user.id;
        const db = await openDb();
        const blocked = await db.all(
            `SELECT blocked_user_id
            FROM blocked_users
            WHERE user_id = ?`,
            [me]
        );
        return blocked;
    });

    fastify.post("/friends/remove", { preHandler: fastify.authenticate }, async(req) => {
        const me = req.user.id;
        const { friend_id } = req.body;
        const db = await openDb();
        await db.run(
            `DELETE FROM friends
            WHERE (user_id = ? AND friend_id = ?)
            OR (user_id = ? AND friend_id = ?)`,
            [me, friend_id, friend_id, me]
        );
        return { success: true }
    });
}