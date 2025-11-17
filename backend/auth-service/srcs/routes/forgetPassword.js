import { findUserByEmail } from "../models/user.js"
import { saveResetToken } from "../models/forget_pass.js";
import { sendResetEmail } from "../utils/email.js"
import crypto from "crypto"

export function forgetPasswordRoute(fastify) {
    fastify.post("/forget-password", async (request, reply) => {
        const { email } = request.body;
        if (!email)
            return reply.code(400).send({error: "Email is required"});
        const user = await findUserByEmail(email);
        if (!user)
            return reply.code(400).send({error: "No such user"});

        //generating reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expireAt = Date.now() + 60 * 60 * 1000 //1hour

        //save token
        await saveResetToken(user.id, resetToken, expireAt);
        console.log(user.email)
        console.log(email)
        await sendResetEmail(user.email, resetToken);

        return reply.send({error: "Check your email we sent a reset link"})
    })
}