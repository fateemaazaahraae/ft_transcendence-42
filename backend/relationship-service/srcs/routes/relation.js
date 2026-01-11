import { openDb } from "../db/db.js"

export async function relationRoutes(fastify) {

    //Send friend request
    fastify.post("/friends/request", { preHandler: fastify.authenticate }, async (req, rep) => {
        const from = req.user.id;
        const { to } = req.body;
        const db = await openDb();

        // BEFORE creating friend request
        const isBlocked = await db.get(
        `SELECT 1 FROM blocked_users
        WHERE (user_id = ? AND blocked_user_id = ?)
            OR (user_id = ? AND blocked_user_id = ?)`,
        [from, to, to, from]
        );

        if (isBlocked)
            return rep.code(403).send({
                error: "You can't sent the request, user blocked you"
            });

        await db.run(
            `INSERT OR IGNORE INTO friends
            (user_id, friend_id, status, created_at)
            VALUES (?, ?, 'pending', ?)`,
            [from, to, Date.now()]
        );
        // notif
        try {
            const id = from;
            const fromUserRes = await fetch(`http://auth-service:3000/users/${id}`);
            const fromUser = await fromUserRes.json()
            await fetch("http://notification-service:3005/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: to,
                    type: "FRIEND_REQUEST",
                    payload: { fromUserId: from, fromUserName: fromUser.userName}
                })
            });
        }
        catch(err) {
            console.error("Failed to send notification:", err.message);
        }
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
        // notif
        // try {
        //     const id = me;
        //     const fromUserRes = await fetch(`http://auth-service:3000/users/${id}`);
        //     const fromUser = await fromUserRes.json()
        //     await fetch("http://notification-service:3005/notifications", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             userId: from,
        //             type: "FRIEND_REQUEST_ACCEPTED",
        //             payload: { fromUserId: from, fromUserName: fromUser.userName}
        //         })
        //     });
        // }
        // catch(err) {
        //     console.error("Failed to send notification:", err.message);
        // }

        //  REALTIME PART 
        try {
            await fetch("http://chat-service:4000/internal/friend-accepted", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-service-token": process.env.SERVICE_TOKEN
                },
                body: JSON.stringify({
                    userId: me,
                    friendId: from
                })
            });
        }
        catch (e) {
            console.error('friend accepted realtime failed', e);
        }
        // notif
        try {
            const id = me;
            const fromUserRes = await fetch(`http://auth-service:3000/users/${id}`);
            const fromUser = await fromUserRes.json()
            await fetch("http://notification-service:3005/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: from,
                    type: "FRIEND_REQUEST_ACCEPTED",
                    payload: { fromUserId: from, fromUserName: fromUser.userName}
                })
            });
        }
        catch(err) {
            console.error("Failed to send notification:", err.message);
        }

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
    fastify.post("/block", { preHandler: fastify.authenticate }, async (req, reply) => {
        const user_id = req.user?.id;
        const { blockedId } = req.body;

        // validate
        if (!blockedId) {
            try { console.warn(' POST /block missing blockedId from user:', user_id); } catch (e) {}
            return reply.code(400).send({ error: 'missing blockedId' });
        }

        const db = await openDb();
        try {
            await db.run(
                `INSERT OR IGNORE INTO blocked_users (user_id, blocked_user_id, created_at)
                VALUES (?, ?, ?)`,
                [user_id, blockedId, Date.now()]
            );

            await db.run(
                `DELETE FROM friends
                WHERE (user_id = ? AND friend_id = ?)
                OR (user_id = ? AND friend_id = ?)`,
                [user_id, blockedId, blockedId, user_id]
            );

            return { success: true, blocked: { user_id: String(user_id), blocked_user_id: String(blockedId) } };
        } catch (err) {
            console.error(' /block error:', err && err.message ? err.message : err);
            return reply.code(500).send({ error: 'block failed' });
        }
    });

// DEBUG: dump blocked_users (local testing only - remove when done)
    fastify.get('/debug/blocked-all', async (req, reply) => {
    const db = await openDb();
    const rows = await db.all('SELECT user_id, blocked_user_id, created_at FROM blocked_users');
    return reply.send(rows);
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
        // DEBUG: log incoming Authorization header for troubleshooting
        try { console.log(' /friends/status incoming Authorization:', req.headers.authorization); } catch (e) {}
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

    // is-blocked check (used by chat-service)
    fastify.get('/is-blocked/:blockerId/:blockedId', async (req, reply) => {
        const { blockerId, blockedId } = req.params;
        const incomingServiceToken = req.headers['x-service-token'] || req.headers['X-Service-Token'];
        const serviceToken = process.env.SERVICE_TOKEN || 'dev_service_token';

        // If correct service token provided, allow the check
        if (incomingServiceToken && incomingServiceToken === serviceToken) {
            try { console.log('[rel] /is-blocked called with valid service token'); } catch (e) {}
        } else {
            // Otherwise require user JWT and allow only the blocker to query
            try {
                await fastify.authenticate(req, reply);
                if (String(req.user.id) !== String(blockerId)) {
                    return reply.code(403).send({ error: 'Forbidden' });
                }
            } catch (e) {
                return reply.code(401).send({ error: 'Unauthorized' });
            }
        }

        const db = await openDb();
        const row = await db.get(
            `SELECT 1 FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?`,
            [blockerId, blockedId]
        );
        return { isBlocked: !!row };
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