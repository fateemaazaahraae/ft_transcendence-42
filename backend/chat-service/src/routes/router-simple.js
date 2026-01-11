import fp from "fastify-plugin";
import history from "../services/history.js";
import { blockUser, isBlocked, unblock } from "../controllers/blockController.js";
import { getContacts, searchContacts } from "../controllers/contactsController.js";
import { socket as ioInstance } from "../controllers/wsManager.js";


export default fp(async (fastify) => {

  //get all contacts with last message
  // require JWT for chat endpoints and populate request.user
  const ensureAuth = async (request, reply) => {
    try {
      const payload = await request.jwtVerify();
      request.user = payload;
    } catch (e) {
      request.log && request.log.warn && request.log.warn('unauthorized access to chats route');
      return reply.code(401).send([]);
    }
  };

  fastify.get('/api/chats/contacts', { preHandler: ensureAuth }, getContacts);

  // Internal endpoint used by relationship-service to notify chat-service
  fastify.post('/internal/friend-accepted', async (request, reply) => {
    console.log("🔥 FRIEND ACCEPTED EVENT", request.body);
    const incomingServiceToken = request.headers['x-service-token'] || request.headers['X-Service-Token'];
    const serviceToken = process.env.SERVICE_TOKEN;

    // If a SERVICE_TOKEN is set, require the header to match.
    if (serviceToken) {
      if (!incomingServiceToken || incomingServiceToken !== serviceToken) {
        request.log && request.log.warn && request.log.warn('internal friend-accepted: invalid or missing x-service-token');
        return reply.code(403).send({ error: 'forbidden' });
      }
    } else {
      request.log && request.log.warn && request.log.warn('SERVICE_TOKEN not set — accepting internal friend-accepted without token (dev mode)');
    }

    const { userId, friendId } = request.body || {};
    if (!userId || !friendId) return reply.code(400).send({ error: 'missing' });

    const io = ioInstance;
    if (!io) {
      request.log && request.log.error && request.log.error('socket.io instance not initialized');
      return reply.code(500).send({ error: 'socket_not_ready' });
    }

    try {
      io.to(String(userId)).emit('friend_accepted', { friendId });
      io.to(String(friendId)).emit('friend_accepted', { friendId: userId });
      return reply.send({ success: true });
    } catch (e) {
      request.log && request.log.error && request.log.error('failed to emit friend_accepted', e);
      return reply.code(500).send({ error: 'emit_failed' });
    }
  });




// search contacts by username
fastify.get('/api/chats/search/:userId', searchContacts);

// block user
fastify.post('/api/block', blockUser);
fastify.get('/api/is-blocked/:blockerId/:blockedId',isBlocked);
fastify.post('/api/unblock', unblock);


//fetch history between users 
fastify.get('/api/chats/history/:userId1/:userId2', async (request, reply) => {
  const { userId1, userId2 } = request.params;
  const authHeader = request.headers.authorization || '';
  const { convo, messages } = await history.getHistory(userId1, userId2, 200, authHeader);
  return reply.send({ convo, messages });
});

});



 
