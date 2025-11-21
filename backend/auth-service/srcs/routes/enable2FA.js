import { openDb } from "../models/db"

export function disableOrEnable2FA(fastify) {
    fastify.put("/settings/2fa", { preValidation: [fastify.authenticate] }, async(req, reply) => {
        const { enable } = req.body;
        const userId = req.user.id;

        const db = await openDb();
        await db.run("UPDATE users SET isTwoFactorEnabled = ? WHERE id = ?", [
            enable ? 1 : 0,
            userId
        ]);
        return reply.send({
            message: enable ? "2FA enabled" : "2FA disabled"
        });
    });
}