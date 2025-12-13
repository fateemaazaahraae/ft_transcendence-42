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
  console.log("Router registered successfully");
  try {
    console.log("Fastify routes:\n" + app.printRoutes());
  } catch (e) {
    console.error("Failed to print routes:", e);
  }
} catch (err) {
  console.error("Failed to register router:", err);
}

app.get("/", (request, reply) => ({ status: "Chat service running" }));

const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Chat service listening on port ${PORT}`);
    try {
      initSocket(app.server);
      console.log("Socket.io initialized");
    } catch (e) {
      console.error("Failed to initialize socket.io", e);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();