import { openDb } from "../models/db"

export default function notificationsRoutes(fastify)
{
    // ---- GET NOTIF ----
    fastify.get("notifications/:userId", async(req) => {
        const { userId } = req.params;
        const db = openDb();
        const notif = await db.all(
            `SELECT * FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [userId]
        );
        return notif;
    });

    // ---- CREATE A NOTIF ----
    fastify.post("notifications", async(req) => {})
}