import { GameLogic } from "./models/GameLogic.js"
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import GameRoutes from "./routes/gameRoutes.js"
import { tournamentRoutes } from "./routes/TournamentRoute.js";

const fastify = Fastify({ logger: true });


fastify.register(fastifyCors, {
  origin: '*',
});

fastify.register(GameRoutes);
fastify.register(tournamentRoutes);


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