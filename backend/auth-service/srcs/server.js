import "./config/env.js"
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { registerRoutes } from "./routes/register.js";
import { loginRoutes } from "./routes/login.js";
import { googleAuthRoutes } from "./routes/googleAuth.js";
import { intra42AuthRoutes } from "./routes/fortyTwoAuth.js";
import { twoFactorRoutes } from "./routes/twoFactor.js"
import { forgetPasswordRoute } from "./routes/forgetPassword.js";
import { resetPasswordRoutes } from "./routes/resetPassword.js";
import avatarRoutes from "./routes/avatar.js";
import { authenticate } from "./plugins/auth.js";
import userRoutes from "./routes/settingsRequests.js";
import fastifyMultipart from "@fastify/multipart";


const fastify = Fastify({ logger: true });
await fastify.register(fastifyCors, {
  origin: '*',
  credentials: true,
});
// JWT setup
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });
await fastify.register(fastifyMultipart, {
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Routes
registerRoutes(fastify);
await authenticate(fastify);
avatarRoutes(fastify);
loginRoutes(fastify);
googleAuthRoutes(fastify);
fastify.register(intra42AuthRoutes);

twoFactorRoutes(fastify)
forgetPasswordRoute(fastify);
resetPasswordRoutes(fastify);
userRoutes(fastify);
// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      fastify.log.info(`Server listening at ${address}`)
    })

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
