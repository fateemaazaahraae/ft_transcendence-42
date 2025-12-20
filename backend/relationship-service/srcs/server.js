import "./config/env.js"
import Fastify from "fastify"
import { authPlugin } from "./plugins/auth.js";
import { relationRoutes } from "./routes/relation.js";

const fastify = Fastify({ logger: true });

await fastify.register(authPlugin);
// const db = await openDb();
// fastify.decorate("db", db);
await fastify.register(relationRoutes);
fastify.listen({ port: 3002, host: "0.0.0.0" }, () => {
    console.log("Relationship service running on 3002");
});