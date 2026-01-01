import fp from "fastify-plugin";
import history from "../services/history.js";
import { blockUser, isBlocked, unblock } from "../controllers/blockController.js";
import { getContacts, searchContacts } from "../controllers/contactsController.js";


export default fp(async (fastify) => {

  //get all contacts with last message
fastify.get('/api/chats/contacts/:userId', getContacts);

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



 
