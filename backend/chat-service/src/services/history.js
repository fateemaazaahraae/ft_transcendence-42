import Conversation from "../models/conversation.js";
import Messages from "../models/messages.js";
import Blocked from "../models/blocked.js";

const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';
const AUTH_URL = process.env.AUTH_URL || 'http://auth-service:3000';

// simple in-memory cache for avatars: { id -> { url, ts } }
const avatarCache = new Map();
const AVATAR_TTL = 1000 * 60 * 5; // 5 minutes

function normalizeAvatar(img) {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;
  if (img.startsWith('/')) return `${AUTH_URL.replace(/\/$/, '')}${img}`;
  return `${AUTH_URL.replace(/\/$/, '')}/${img}`;
}

async function fetchAvatarFor(userId, authHeader = '') {
  const key = String(userId);
  const cached = avatarCache.get(key);
  const now = Date.now();
  if (cached && (now - cached.ts) < AVATAR_TTL) return cached.url;

  try {
    const res = await fetch(`${AUTH_URL.replace(/\/$/, '')}/users/${userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    if (!res.ok) {
      avatarCache.set(key, { url: null, ts: now });
      return null;
    }
    const body = await res.json().catch(() => ({}));
    const img = body?.profileImage || body?.profile_image || body?.avatar || null;
    const url = normalizeAvatar(img);
    avatarCache.set(key, { url, ts: now });
    return url;
  } catch (e) {
    avatarCache.set(key, { url: null, ts: now });
    return null;
  }
}

export default {
  sendMessage: async (from, to, content, authHeader = '') => {
    // check if recipient has blocked the sender
    const blocked = await Blocked.isBlocked(authHeader, Number(to), Number(from));
    if (blocked) {
      const err = new Error('blocked');
      err.code = 'BLOCKED';
      throw err;
    }

    // check friendship status via relationship service (minimal check)
    try {
      const res = await fetch(`${REL_SERVICE_URL}/friends/status/${to}`, {
        headers: { Authorization: authHeader }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== 'friend') {
        const err = new Error('not_friend');
        err.code = 'NOT_FRIEND';
        throw err;
      }
    } catch (e) {
      const err = new Error('not_friend');
      err.code = 'NOT_FRIEND';
      throw err;
    }

    // find or create conversation
    const convo = Conversation.findOrCreate(from, to);

    // create message
    const msg = Messages.create(convo.id, from, content);

    // include sender avatar in ack
    try {
      const avatar = await fetchAvatarFor(from, authHeader);
      if (avatar) msg.senderAvatar = avatar;
    } catch (e) {
      // ignore avatar errors
    }

    return { convo, msg }; // ack includes avatar when available
  },

  getHistory: async (userA, userB, limit = 200, authHeader = '') => {
    const convo = Conversation.findOrCreate(userA, userB); // findOrCreate ensures an id
    const messages = Messages.getConversationMessages(convo.id, limit) || [];

    // collect unique sender ids for batch avatar fetch
    const senderIds = Array.from(new Set(messages.map(m => String(m.sender_id))));
    const avatarPromises = {};
    senderIds.forEach(id => {
      avatarPromises[id] = fetchAvatarFor(id, authHeader);
    });

    // wait for all avatar fetches
    await Promise.all(Object.values(avatarPromises));

    // attach senderAvatar to messages (if available in cache)
    const enriched = messages.map((m) => {
      const aid = String(m.sender_id);
      const cached = avatarCache.get(aid);
      if (cached && cached.url) m.senderAvatar = cached.url;
      return m;
    });

    return { convo, messages: enriched };
  }
};