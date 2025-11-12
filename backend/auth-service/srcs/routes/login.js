import bcrypt from "bcryptjs"
import {findUserByUserName } from "../models/user.js";
import { save2FACode } from "../models/2FA.js";
import {send2FACode, generate2FACode} from "../utils/email.js"

export function loginRoutes(fastify) {
    fastify.post("/login", async (request, reply) => {
        try {
            const body = request.body;
            const userName = body.userName || "";
            const password = body.password || "";
            if (!userName)
                return reply.code(400).send({ error: "User name is required" });
            if (!password)
                return reply.code(400).send({ error: "Password is required" });
            console.log("\n\n------> here -------\n\n")
            console.log("\n\n------> here -------\n\n")
            const user = await findUserByUserName(userName);
            if (!user) {
                return reply.code(400).send({ error: "User name or password is incorrect" });
            }
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch)
                return reply.code(400).send({ error: "User name or password is uncorrect" });
            
            //2FA
            const code = generate2FACode();
            const expireAt = Date.now() + 5 * 60 * 1000;
            
            await save2FACode(user.id, code, expireAt);
            await send2FACode(user.email, code);

            //generate JWT
            const token = fastify.jwt.sign(
                {id: user.id, email: user.email},
                { expiresIn: "7d"}
            )

            return reply.code(201).send({
                message: "Check you email, we sent a verification code",
                userId: user.id,
                token
             });
        }
        catch (err) {
            console.error(err);
            return reply.code(500).send({ error: "Internal1 Server Error" });
        }
    });
}