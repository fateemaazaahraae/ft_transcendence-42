import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.get('/chats/contacts/:userId', async (request, reply) => {
    return reply.send({ test: 'working' });
  });
});
