import jwt from "jsonwebtoken";
import fp from "fastify-plugin";

async function authPluginInner(fastify, opts) {
    fastify.decorate("authenticate", async function (request, reply) {
        const authHeader = request.headers.authorization;

        if (!authHeader)
            return reply.code(401).send({ error: "Unauthorized: Missing header" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return reply.code(401).send({ error: "Unauthorized: Missing token" });
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
            request.user = { id: payload.id };
        } catch (err) {
            try { console.warn('[rel-auth] token verification failed:', err && err.message); } catch (e) {}
            return reply.code(401).send({ error: "Unauthorized: Invalid token" });
        }
    });
}

export const authPlugin = fp(authPluginInner);