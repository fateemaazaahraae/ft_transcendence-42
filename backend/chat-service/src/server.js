import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import router from "./routes/router-simple.js";
import { initSocket } from "./controllers/wsManager.js";
import db from "./config/db.js";

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 4000;

await fastify.register(fastifyCors, { origin: "*" });
await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET});

await fastify.register(router, { prefix: "/api" });

fastify.get("/", async () => ({ status: "chat service running" }));

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`chat-service listening on port ${PORT}`);
    try {
      initSocket(fastify.server);
      fastify.log.info('socket.io initialized');
    } catch (e) {
      fastify.log.error({ err: e }, 'failed to initialize socket.io');
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();