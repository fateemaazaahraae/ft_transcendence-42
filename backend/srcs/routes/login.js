import bcrypt from "bcryptjs"
import {findUserByUserName } from "../models/user.js";

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
            const token = fastify.jwt.sign({id: user.id, userName: user.userName});
            return reply.send({token});
        }
        catch (err) {
            console.error(err);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });
}