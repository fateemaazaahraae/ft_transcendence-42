import { StartTournament } from "./models/Tournament.js";
import TournamentRoutes from "./routes/Tournament.js";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, { origin: '*' });

// fastify.get('/test', async (request, reply) => {
//     return { message: 'tournament server is Running!' };
// });

fastify.register(TournamentRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3004, host: '0.0.0.0' });
    console.log('✅ Tournament HTTP Server running at http://localhost:3004');
    StartTournament(fastify.server);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
