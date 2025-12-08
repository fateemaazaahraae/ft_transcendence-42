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
            const user = await findUserByUserName(userName);
            if (!user) {
                return reply.code(400).send({ error: "User name or password is incorrect" });
            }
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch)
                return reply.code(400).send({ error: "User name or password is uncorrect" });
            
            //generate JWT
            const token = fastify.jwt.sign(
            {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                profileImage: user.profileImage
            },
            { expiresIn: "7d" }
            );


            //2FA
            if (user.isTwoFactorEnabled === 1)
            {
                const code = generate2FACode();
                const expireAt = Date.now() + 5 * 60 * 1000;
                
                await save2FACode(user.id, code, expireAt);
                await send2FACode(user.email, code);
                return reply.code(200).send({
                    message: "Check your email, we sent a verification code",
                    userId: user.id,
                    token,
                    isTwoFactorEnabled: user.isTwoFactorEnabled
                });
            }

            return reply.code(200).send({
                message: "Login successful",
                token,
                isTwoFactorEnabled: user.isTwoFactorEnabled,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    profileImage: user.profileImage
                }
            });
        }
        catch (err) {
            console.error(err);
            return reply.code(500).send({ error: "Internal1 Server Error" });
        }
    });
}