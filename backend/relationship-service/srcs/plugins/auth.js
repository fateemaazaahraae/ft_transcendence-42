import jwt from "jsonwebtoken";
import fp from "fastify-plugin";

async function authPluginInner(fastify, opts) {
    fastify.decorate("authenticate", async function (request, reply) {
        const authHeader = request.headers.authorization;
        // TEMP DEBUG: log incoming Authorization header for troubleshooting
        try { console.log('[auth] incoming Authorization header:', authHeader); } catch (e) {}
        
        if (!authHeader)
            return reply.code(401).send({ error: "Unauthorized: Missing header" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return reply.code(401).send({ error: "Unauthorized: Missing token" });
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
            request.user = { id: payload.id };
        } catch (err) {
            return reply.code(401).send({ error: "Unauthorized: Invalid token" });
        }
    });
}

export const authPlugin = fp(authPluginInner);