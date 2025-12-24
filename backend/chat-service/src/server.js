import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import router from "./routes/router-simple.js";
import { initSocket } from "./controllers/wsManager.js";
import db from "./config/db.js";

const app = Fastify({ logger: true });
const PORT = process.env.PORT || 4000;

await app.register(fastifyCors, { origin: "*" });
await app.register(fastifyJwt, { secret: process.env.JWT_SECRET || "supersecret" });

try {
  await app.register(router, { prefix: "/api" });
  console.log("router registered successfully");
  
} catch (err) {
  console.error("failed to register router:", err);
}

app.get("/", (request, reply) => ({ status: "chat service running" }));

const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`chat service listening on port ${PORT}`);
    try {
      initSocket(app.server);
      console.log("socket.io initialized");
    } catch (e) {
      console.error("failed to initialize socket.io", e);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();