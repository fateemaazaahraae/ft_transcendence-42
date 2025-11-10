import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { registerRoutes } from "./routes/register.js";
import { loginRoutes } from "./routes/login.js";
import { googleAuthRoutes } from "./routes/googleAuth.js";
import { intra42AuthRoutes } from "./routes/fortyTwoAuth.js";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
});
// JWT setup
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Routes
registerRoutes(fastify);
loginRoutes(fastify);
googleAuthRoutes(fastify);
fastify.register(intra42AuthRoutes);

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
