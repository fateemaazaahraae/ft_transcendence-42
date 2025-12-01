import Fastify from "fastify";

const app =Fastify({
    logger: true
});
const PORT = process.env.PORT || 4000;

//needs more understand 
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