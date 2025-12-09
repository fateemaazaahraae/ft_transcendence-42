import fastify from "fastify";
import fp from "fastify-plugin";
import db from "../config/db.js";
import * as messageController from "../controllers/messageController.js";
import conversationModel from "../models/conversation.js";
import messagesModel from "../models/messages.js";
import * as blockController from "../controllers/blockController.js";

export default fp(async (fastify,opts)=>{
  
  const API_URL = process.env.API_URL || 'http://auth-service:3000';
  fastify.post("/messages/send", async (req, reply) => {
    return messageController.sendMessageHandler(req, reply);
  });

  fastify.get("/messages/history/:userA/:userB", async (req, reply) => {
    return messageController.getHistoryHandler(req, reply);
  });

  // Conversation-based contacts list (returns other participant and last message)
  fastify.get('/chats/contacts/:userId', async (request, reply) => {
    return reply.send({ test: 'working' });
  });

  // Get messages for a conversation between two users
  fastify.get('/chats/messages/:userId/:contactId', async (request, reply) => {
    const { userId, contactId } = request.params;
    try {
      // find or create conversation
      const convo = conversationModel.findOrCreate(userId, contactId);
      const messageList = messagesModel.getConversationMessages(convo.id, 1000);
      return reply.send(messageList);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'failed' });
    }
  });

  // Send message (creates conversation if needed)
  fastify.post('/chats/send', async (request, reply) => {
    const { sender_id, receiver_id, content } = request.body || {};
    if (!sender_id || !receiver_id || !content) return reply.code(400).send({ error: 'missing_fields' });
    try {
      const convo = conversationModel.findOrCreate(String(sender_id), String(receiver_id));
      const msg = messagesModel.create(convo.id, String(sender_id), content);
      return reply.code(201).send(msg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'failed' });
    }
  });

  // block
  fastify.post("/block", async (req, reply) => {
    return blockController.blockHandler(req, reply);
  });

  fastify.post("/unblock", async (req, reply) => {
    return blockController.unblockHandler(req, reply);
  });

  // Users search endpoint for frontend (query param: q, userId)
  fastify.get('/users/search', async (request, reply) => {
    const q = String(request.query.q || '').trim();
    const userId = String(request.query.userId || '0');

    if (!q) return reply.send([]);

    try {
      const term = `%${q}%`;
      const stmt = db.prepare(`
        SELECT id, userName as username, profileImage as avatar, COALESCE(status,'offline') as status
        FROM users
        WHERE userName LIKE ?
          AND id != ?
          AND id NOT IN (SELECT blocked_id FROM blocked_users WHERE blocker_id = ?)
        LIMIT 50;
      `);
      const results = stmt.all(term, userId, userId);
      return reply.send(results);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'search-failed' });
    }
  });

});