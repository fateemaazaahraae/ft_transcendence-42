import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import router from "./routes/router-simple.js";
import { initSocket } from "./controllers/wsManager.js";
import db from "./config/db.js";

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 4000;

await fastify.register(fastifyCors, { origin: "*" });
await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || "supersecret" });

try {
  await fastify.register(router, { prefix: "/api" });
} catch (err) {
  console.error("failed to register router:", err);
}

fastify.get("/", (request, reply) => ({ status: "chat service running" }));

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    try {
      initSocket(fastify.server);
    } catch (e) {
      console.error("failed to initialize socket.io", e);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();