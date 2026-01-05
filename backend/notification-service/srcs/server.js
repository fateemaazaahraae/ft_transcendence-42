import "./config/env.js";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import notificationsRoutes from "./routes/notifications.js";

const fastify = Fastify({ logger: true });

await fastify.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

fastify.register(notificationsRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3005, host: "0.0.0.0" });
    console.log("Notification service running on port 3005");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();