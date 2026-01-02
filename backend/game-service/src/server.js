import { GameLogic } from "./models/GameLogic.js"
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import testRoute from "./routes/gameRoutes.js"
import matchesRoute from "./routes/gameRoutes.js"
import WLXPRoute from "./routes/gameRoutes.js"

const fastify = Fastify({ logger: true });

// Note: Remove the 'await' before fastify.register
fastify.register(fastifyCors, {
  origin: '*',
});

WLXPRoute(fastify);
matchesRoute(fastify);
testRoute(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3003, host: '0.0.0.0' });
    console.log('✅ HTTP Server running at http://localhost:3003');

    GameLogic(fastify.server);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();