import "./config/env.js"
import Fastify from "fastify"
import fastifyCors from "@fastify/cors";
import { authPlugin } from "./plugins/auth.js";
import { relationRoutes } from "./routes/relation.js";

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
  origin: '*',
  credentials: true,
  methods: ['GET','PUT','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

await fastify.register(authPlugin);
// const db = await openDb();
// fastify.decorate("db", db);
await fastify.register(relationRoutes);
fastify.listen({ port: 3002, host: "0.0.0.0" }, () => {
    console.log("Relationship service running on 3002");
});