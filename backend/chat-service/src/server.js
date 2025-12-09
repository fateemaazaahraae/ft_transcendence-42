import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";

import router from "./routes/router-simple.js";
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
try {
  await app.register(router,{prefix: "/api"});
  console.log('Router registered successfully');
} catch (err) {
  console.error('Failed to register router:', err);
}

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
    // initialize socket.io server
    try {
      initSocket(app.server);
      console.log('Socket.io initialized');
    } catch (e) {
      console.error('Failed to initialize socket.io', e);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();