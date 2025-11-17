import bcrypt from "bcryptjs";
import { findUserByResetToken, updatePassword } from "../models/forget_pass.js";

export function resetPasswordRoutes(fastify) {
    fastify.post("/reset-password", async (request, reply) => {
        const { token, newPassword } = request.body;

        if (!token || !newPassword)
            return reply.code(400).send({error: "Token and new password are required"});

        const user = await findUserByResetToken(token)
        if (!user || user.resetTokenExpire < Date.now())
                return reply.code(400).send({error: "Invalid or expired token"})

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await updatePassword(user.user_id, passwordHash);

        return reply.code(200).send({error: "Password has been reset successfully"});
    })
}