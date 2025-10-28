import Fastify from "fastify";
import { registerRoutes } from "./routes/register.ts";

const fastify = Fastify({ logger: true });

// Register routes
registerRoutes(fastify);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
