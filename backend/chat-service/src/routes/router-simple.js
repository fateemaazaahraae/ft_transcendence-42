import fp from "fastify-plugin";
import history from "../services/history.js";
import { blockUser, isBlocked, unblock } from "../controllers/blockController.js";
import { getContacts, searchContacts } from "../controllers/contactsController.js";
import { socket as ioInstance, suppressReonline } from "../controllers/wsManager.js";


export default fp(async (fastify) => {

  //get all contacts with last message
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

  //  endpoint used by relationship-service to notify chat-service
  fastify.post('/internal/friend-accepted', async (request, reply) => {
    console.log("FRIEND ACCEPTED EVENT", request.body);
    const incomingServiceToken = request.headers['x-service-token'] || request.headers['X-Service-Token'];
    const serviceToken = process.env.SERVICE_TOKEN;

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
      console.log('[internal] emitted friend_accepted to', userId, 'and', friendId);
      return reply.send({ success: true });
    } catch (e) {
      request.log && request.log.error && request.log.error('failed to emit friend_accepted', e);
      return reply.code(500).send({ error: 'emit_failed' });
    }
  });

  //relationship-service notifies that a user blocked another
  fastify.post('/internal/user-blocked', async (request, reply) => {
    const incomingServiceToken = request.headers['x-service-token'] || request.headers['X-Service-Token'];
    const serviceToken = process.env.SERVICE_TOKEN;
    if (serviceToken) {
      if (!incomingServiceToken || incomingServiceToken !== serviceToken) {
        request.log && request.log.warn && request.log.warn('internal user-blocked: invalid or missing x-service-token');
        return reply.code(403).send({ error: 'forbidden' });
      }
    }

    const { by, blockedId } = request.body || {};
    if (!by || !blockedId) return reply.code(400).send({ error: 'missing' });

    const io = ioInstance;
    if (!io) {
      request.log && request.log.error && request.log.error('socket.io instance not initialized');
      return reply.code(500).send({ error: 'socket_not_ready' });
    }

    try {
      io.to(String(blockedId)).emit('you_were_blocked', { by });
      io.to(String(by)).emit('block_done', { target: blockedId });
      io.to(String(by)).emit('user_offline', { userId: String(blockedId) });
      try { suppressReonline(by, blockedId, 3000); } catch (e) { request.log.warn('suppressReonline failed', e); }
      request.log && request.log.info && request.log.info({ by, blockedId }, '[internal] user-blocked emitted');
      return reply.send({ success: true });
    } catch (e) {
      request.log && request.log.error && request.log.error('failed to emit internal user-blocked', e);
      return reply.code(500).send({ error: 'emit_failed' });
    }
  });


  fastify.post('/internal/user-unblocked', async (request, reply) => {
    const incomingServiceToken = request.headers['x-service-token'] || request.headers['X-Service-Token'];
    const serviceToken = process.env.SERVICE_TOKEN;
    if (serviceToken) {
      if (!incomingServiceToken || incomingServiceToken !== serviceToken) {
        request.log && request.log.warn && request.log.warn('internal user-unblocked: invalid or missing x-service-token');
        return reply.code(403).send({ error: 'forbidden' });
      }
    }

    const { by, blockedId } = request.body || {};
    if (!by || !blockedId) return reply.code(400).send({ error: 'missing' });

    const io = ioInstance;
    if (!io) {
      request.log && request.log.error && request.log.error('socket.io instance not initialized');
      return reply.code(500).send({ error: 'socket_not_ready' });
    }

    try {
      io.to(String(blockedId)).emit('you_were_unblocked', { by });
      io.to(String(by)).emit('unblock_done', { target: blockedId });

      // if unblocked user is online inform the unblocking user
      try {
        const room = io.sockets && io.sockets.adapter && io.sockets.adapter.rooms && io.sockets.adapter.rooms.get(String(blockedId));
        const isOnline = room && room.size > 0;
        if (isOnline) {
          io.to(String(by)).emit('user_online', { userId: String(blockedId) });
        }
      } catch (inner) {
        request.log && request.log.warn && request.log.warn('presence post-unblock check failed', inner);
      }

      request.log && request.log.info && request.log.info({ by, blockedId }, '[internal] user-unblocked emitted');
      return reply.send({ success: true });
    } catch (e) {
      request.log && request.log.error && request.log.error('failed to emit internal user-unblocked', e);
      return reply.code(500).send({ error: 'emit_failed' });
    }
  });




// search contacts by username
fastify.get('/api/chats/search/:userId', searchContacts);

// block user
fastify.post('/api/block', { preHandler: ensureAuth }, blockUser);
fastify.get('/api/is-blocked/:blockerId/:blockedId', isBlocked);
fastify.post('/api/unblock', { preHandler: ensureAuth }, unblock);


//fetch history between users 
fastify.get('/api/chats/history/:userId1/:userId2', async (request, reply) => {
  const { userId1, userId2 } = request.params;
  const authHeader = request.headers.authorization || '';
  const { convo, messages } = await history.getHistory(userId1, userId2, 200, authHeader);
  return reply.send({ convo, messages });
});

});



 
