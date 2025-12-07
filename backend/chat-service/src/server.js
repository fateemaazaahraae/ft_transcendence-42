import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "cors";

import router from "./routes/router.js";
import { initSocket } from "./controllers/wsManager.js";
import db from "./config/db.js"

const app =Fastify({
    logger: true
});
const PORT = process.env.PORT || 4000;

// CORS
await app.register(fastifyCors, {
  origin: "*"
});

// JWT (si tu en as besoin)
await app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "supersecret"
});

// Routes
app.register(router,{prefix: "/api"});

app.get('/', async (request, reply) => {
  return { status: 'Chat service running' };
});

// IMPORTANT: Listen on 0.0.0.0, not localhost
const start = async () => {
  try {
    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0'  // This is crucial for Docker!!!!
    });
    console.log(`Chat service listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();