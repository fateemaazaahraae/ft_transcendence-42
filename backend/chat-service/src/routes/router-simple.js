import fp from "fastify-plugin";
import db from "../config/db.js";
import conversationModel from "../models/conversation.js";

export default fp(async (fastify) => {
  fastify.get('/chats/contacts/:userId', async (request, reply) => {
    try {
      const userId = String(request.params.userId || '');
      const convos = conversationModel.listForUser(userId);
      
      const contacts = convos.map((c) => {
        const contactId = c.user_a === userId ? c.user_b : c.user_a;
        const userRow = db.prepare('SELECT id, userName as username, profileImage as avatar, COALESCE(status, "offline") as status FROM users WHERE id = ?').get(contactId);
        const lastMsg = db.prepare('SELECT content, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1').get(c.id) || null;
        return {
          id: userRow?.id || contactId,
          username: userRow?.username || String(contactId),
          avatar: userRow?.avatar || null,
          status: userRow?.status || 'offline',
          last_message: lastMsg ? lastMsg.content : null,
          last_message_timestamp: lastMsg ? lastMsg.created_at : null,
          conversation_id: c.id
        };
      });
      
      return reply.send(contacts);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'failed', details: err.message });
    }
  });
});

