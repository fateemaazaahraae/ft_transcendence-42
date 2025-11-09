import "./config/env.js"
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { registerRoutes } from "./routes/register.js";
import { loginRoutes } from "./routes/login.js";
import { twoFactorRoutes } from "./routes/twoFactor.js"
import { forgetPasswordRoute } from "./routes/forgetPassword.js";
import { resetPasswordRoutes } from "./routes/resetPassword.js";

const fastify = Fastify({ logger: true });
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret"
});

// Register routes
registerRoutes(fastify);
loginRoutes(fastify);
twoFactorRoutes(fastify)
forgetPasswordRoute(fastify);
resetPasswordRoutes(fastify);
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
