import { openDb } from "../models/db.js";

export default function notificationsRoutes(fastify) {

    // ---- GET NOTIF ----
    fastify.get("/notifications/:userId", async (req) => {
        const { userId } = req.params;
        const db = await openDb();
        const notif = await db.all(
            `SELECT * FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [userId]
        );
        const notifications = notif.map(n => ({
            ...n,
            payload: n.payload ? JSON.parse(n.payload) : {}
        }));
        return notifications;
    });

    // ---- CREATE A NOTIF ----
    fastify.post("/notifications", async (req, rep) => {
        const { userId, type, payload } = req.body;
        console.log("-------------------------------\n")
        console.log(`${userId} ----- ${type} ------ ${payload.fromUserName}\n`);
        console.log("-------------------------------\n")
        if (!userId || !type)
            return rep.status(400).send({ error: "user_id and type are required" });
        
        const db = await openDb();
        const payloadString = payload ? JSON.stringify(payload) : null;
        await db.run(
            `INSERT INTO notifications (user_id, type, payload) VALUES (?, ?, ?)`,
            [userId, type, payloadString]
        );
        return { status: "success" };
    });

    // ---- MARK AS READ ----
    fastify.put("/notifications/:id/read", async (req) => {
        const { id } = req.params;
        const db = await openDb();
        await db.run(
            `UPDATE notifications SET is_read = 1 WHERE id = ?`,
            [id]
        );
        return { status: "success" };
    });
}