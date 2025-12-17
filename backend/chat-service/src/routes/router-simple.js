import fp from "fastify-plugin";
import db from "../config/db.js";
import conversationModel from "../models/conversation.js";
import friendsModel from "../models/friends.js";
import blockedModel from "../models/blocked.js";
import history from "../services/history.js";

const API_URL = process.env.API_URL || 'http://auth-service:3000';

// Helper: Get user info and build contact object
const buildContact = async (userId, contactId) => {
  let userRow = null;
  try {
    const res = await fetch(`${API_URL}/api/users/${contactId}`);
    if (res.ok) {
      const json = await res.json();
      userRow = { id: json.id, username: json.userName || json.username, avatar: json.profileImage || json.avatar, status: json.status || 'offline' };
    }
  } catch (e) {}
  
  if (!userRow) {
    userRow = db.prepare('SELECT id, userName as username, profileImage as avatar, COALESCE(status, \'offline\') as status FROM users WHERE id = ?').get(contactId);
  }
  
  const convo = db.prepare('SELECT id FROM conversations WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)').get(userId, contactId, contactId, userId);
  const lastMsg = convo ? db.prepare('SELECT content, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1').get(convo.id) : null;
  
  return {
    id: userRow?.id || contactId,
    username: userRow?.username || String(contactId),
    avatar: userRow?.avatar || null,
    status: userRow?.status || 'offline',
    last_message: lastMsg?.content || null,
    last_message_timestamp: lastMsg?.created_at || null,
    conversation_id: convo?.id || null
  };
};

export default fp(async (fastify) => {
  fastify.get('/api/chats/contacts/:userId', async (request, reply) => {
    try {
      const userId = String(request.params.userId || '');
      const friends = friendsModel.listFriends(userId);
      const contacts = await Promise.all(friends.map(f => buildContact(userId, f.user_a === userId ? f.user_b : f.user_a)));
      return reply.send(contacts);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'failed', details: err.message });
    }
  });

  fastify.get('/api/chats/search/:userId', async (request, reply) => {
    try {
      const userId = String(request.params.userId || '');
      const query = String(request.query.q || '').toLowerCase();
      if (!query) return reply.send([]);

      const friends = friendsModel.listFriends(userId);
      const contacts = await Promise.all(friends.map(f => buildContact(userId, f.user_a === userId ? f.user_b : f.user_a)));
      
      const results = contacts.filter(c => c.username?.toLowerCase().includes(query));
      return reply.send(results);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'search failed', details: err.message });
    }
  });

  // Block a user
  fastify.post('/api/block', async (request, reply) => {
    try {
      const { blockerId, blockedId } = request.body || {};
      if (!blockerId || !blockedId) {
        return reply.code(400).send({ error: 'missing blockerId or blockedId' });
      }
      const entry = blockedModel.block(blockerId, blockedId);
      return reply.code(201).send(entry);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'block failed', details: err.message });
    }
  });

  fastify.get('/api/is-blocked/:blockerId/:blockedId', async (request, reply) => {
    try{
      const blockerId=String(request.params.blockerId || '');
      const blockedId=String(request.params.blockedId || '');
      if(!blockerId || !blockedId){
        return reply.code(400).send({error:'missing blockerId or blockedId'});
      }
      const isBlocked=blockedModel.isBlocked(blockerId, blockedId);
      return reply.code(200).send({ isBlocked });
      
    }catch(err){
      fastify.log.error(err);
      return reply.code(500).send({ error: 'check failed', details: err.message });
    
    }

  });
  // Unblock a user
  fastify.post('/api/unblock', async (request, reply) => {
    try {
      const { blockerId, blockedId } = request.body || {};
      if (!blockerId || !blockedId) {
        return reply.code(400).send({ error: 'missing blockerId or blockedId' });
      }
      blockedModel.unblock(blockerId, blockedId);
      return reply.code(200).send({ ok: true, message: 'User unblocked successfully' });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'unblock failed', details: err.message });
    }
  });

  //fetch history between users 
  fastify.get('/api/chats/history/:userId1/:userId2',async (request,reply)=>{
    try{
      const userId1=String(request.params.userId1 || '');
      const userId2=String(request.params.userId2 || '');
      if(!userId1 || !userId2){
        return reply.code(400).send({ error: 'missing userId1 or userId2' });
      }
      const {convo,messages}= history.getHistory(userId1,userId2,200);
      return reply.code(200).send({convo,messages});
    }
    catch(err){
      fastify.log.error(err);
      return reply.code(500).send({ error: 'history fetch failed', details: err.message });

    }
  });
 });