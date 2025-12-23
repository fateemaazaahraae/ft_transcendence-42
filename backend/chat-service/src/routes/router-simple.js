import fp from "fastify-plugin";
import db from "../config/db.js";
import friendsModel from "../models/friends.js";
import blockedModel from "../models/blocked.js";
import history from "../services/history.js";

const API_URL = process.env.API_URL || 'http://auth-service:3000';

//get friends and contacts from relatioship

const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

export default fp(async (fastify) => {

  //get all contacts with last message
fastify.get('/api/chats/contacts/:userId', async (request, reply) => {
  const userId = String(request.params.userId);
  const authHeader = request.headers.authorization || '';
  const friendList = await friendsModel.listFriends(userId);

  
  //contacts with profile data from auth-service
  const contacts = await Promise.all(friendList.map(async (f) => {
    // skip self from contacts
    if (String(f.friend_id) === userId) {
      console.log('skipping self contact:', userId);
      return null;
    }
    
    const convo = db.prepare(
      'SELECT id FROM conversations WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)'
    ).get(userId, f.friend_id, f.friend_id, userId);
    const lastMsg = convo ? db.prepare(
      'SELECT content, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1'
    ).get(convo.id) : null;

    let username = '';
    let avatar = '';
    try {
      const res = await fetch(`${API_URL}/users/${f.friend_id}`, {
        headers: { 'Authorization': authHeader }
      });
      if (res.ok) {
        const u = await res.json();
        username = u?.userName || u?.username || '';
        avatar = u?.profileImage || u?.avatar || '';
      } else {
        console.log(' user profile fetch failed for', f.friend_id, 'status:', res.status);
      }
    } catch (e) {
      console.error(' profile fetch error for', f.friend_id, ':', e.message);
    }

    const displayName = username || String(f.friend_id).slice(0, 8);
    return {
      id: f.friend_id,
      username: displayName,
      avatar,
      status: 'offline',
      last_message: lastMsg?.content,
      last_message_time: lastMsg?.created_at,
      conversation_id: convo?.id
    };
  }));

  
  const filtered = contacts.filter(c => c !== null);  
  return reply.send(filtered);
});

// search contacts (enriched with usernames + avatars)
fastify.get('/api/chats/search/:userId', async (request, reply) => {
  const userId = String(request.params.userId);
  const query = String(request.query.q || '').toLowerCase();
  const authHeader = request.headers.authorization || '';
  const friendList = await friendsModel.listFriends(userId);

  const enriched = await Promise.all(friendList.map(async (f) => {
    if (String(f.friend_id) === userId) return null;

    const convo = db.prepare(
      'SELECT id FROM conversations WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)'
    ).get(userId, f.friend_id, f.friend_id, userId);
    const lastMsg = convo ? db.prepare(
      'SELECT content, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1'
    ).get(convo.id) : null;

    let username = '';
    let avatar = '';
    try {
      const res = await fetch(`${API_URL}/users/${f.friend_id}`, {
        headers: { 'Authorization': authHeader }
      });
      if (res.ok) {
        const u = await res.json();
        username = u?.userName || u?.username || '';
        avatar = u?.profileImage || u?.avatar || '';
      }
    } catch {}

    const displayName = username || String(f.friend_id).slice(0, 8);
    return {
      id: f.friend_id,
      username: displayName,
      avatar,
      status: 'offline',
      last_message: lastMsg?.content,
      conversation_id: convo?.id
    };
  }));

  const filtered = enriched.filter(c => c && (
    String(c.id).toLowerCase().includes(query) ||
    String(c.username).toLowerCase().includes(query)
  ));
  return reply.send(filtered);
});

// block user
fastify.post('/api/block', async (request, reply) => {
  try {
    const { blockedId } = request.body || {};
    const authHeader = request.headers.authorization || '';
    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const result = await blockedModel.block(authHeader, null, blockedId);
    return reply.code(201).send(result);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: 'block failed', details: e.message, payload: e.payload });
  }
});

// if blocked
fastify.get('/api/is-blocked/:blockerId/:blockedId', async (request, reply) => {
  const { blockerId, blockedId } = request.params;
  const authHeader = request.headers.authorization || '';
  const isBlocked = await blockedModel.isBlocked(authHeader, blockerId, blockedId);
  return reply.send({ isBlocked });
});

// unblock user
fastify.post('/api/unblock', async (request, reply) => {
  try {
    const { blockedId } = request.body || {};
    const authHeader = request.headers.authorization || '';
    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const res = await blockedModel.unblock(authHeader, null, blockedId);
    return reply.send(res?.success ? res : { ok: true });
  } catch (e) {
    return reply.code(e.status || 500).send({ error: 'unblock failed', details: e.message, payload: e.payload });
  }
});
//fetch history between users 
fastify.get('/api/chats/history/:userId1/:userId2', async (request, reply) => {
  const { userId1, userId2 } = request.params;
  const { convo, messages } = await history.getHistory(userId1, userId2, 200);
  return reply.send({ convo, messages });
});


});





 
