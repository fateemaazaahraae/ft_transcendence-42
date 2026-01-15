import { findUserByEmail } from "../models/user.js"
import { saveResetToken } from "../models/forget_pass.js";
import { sendResetEmail } from "../utils/email.js"
import crypto from "crypto"

export function forgetPasswordRoute(fastify) {
    fastify.post("/forget-password", async (request, reply) => {
        try {
            const { email } = request.body ?? {};
            if (!email)
                return reply.code(400).send({ error: "Email is required" });

            const user = await findUserByEmail(email);
            if (!user)
                return reply.code(400).send({ error: "No such user" });

            const resetToken = crypto.randomBytes(32).toString("hex");
            const expireAt = Date.now() + 60 * 60 * 1000; // 1 hour

            await saveResetToken(user.id, resetToken, expireAt);
            await sendResetEmail(user.email, resetToken);

            return reply.send({ message: "Check your email we sent a reset link" });
        } catch (err) {
            // log full error for debugging (will appear in docker logs)
            if (fastify && fastify.log && typeof fastify.log.error === "function") {
                fastify.log.error(err);
            } else {
                console.error(err);
            }
            return reply.code(500).send({ error: "Internal server error" });
        }
    });
}