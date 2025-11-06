import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
import { googleAuthRoutes } from "./routes/googleAuth.js";
import { registerRoutes } from "./routes/register.js";
import { loginRoutes } from "./routes/login.js";

dotenv.config();

const fastify = Fastify({ logger: true });

// JWT setup
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Routes
registerRoutes(fastify);
loginRoutes(fastify);
googleAuthRoutes(fastify);

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
