// test-server.js - ONLY THIS FILE FOR NOW
const fastify = require('fastify')({ logger: true });

// Just ONE simple route to test
fastify.get('/test', async (request, reply) => {
  return { message: 'Game service is working!' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: 3003,
      host: '0.0.0.0'
    });
    console.log('✅ Server running at http://localhost:3003');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

start();