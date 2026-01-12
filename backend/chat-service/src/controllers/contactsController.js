import db from '../config/db.js';
// history service not used directly here; keep DB import

const API_URL = process.env.API_URL || 'http://auth-service:3000';
const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

function extractBlockedIdFromBlockedEntry(b) {
  return String(b.blocked_user_id || b.blockedId || b.blocked_user || b.id || '');
}

function extractBlockedIdFromBlockedMeEntry(b) {
  return String(b.user_id || b.blockedBy || b.blocker_id || b.id || '');
}

export async function getContacts(request, reply) {
  const userId = String(request.user.id);
  const authHeader = request.headers.authorization || '';
  let friendList = [];
  let blockedList = [];
  let blockedMe = [];
  try {
    if (!authHeader) {
      return reply.code(401).send([]);
    }
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    const resb = await fetch(`${REL_SERVICE_URL}/blocked`, { headers: { Authorization: authHeader } });
    const resBlockedMe = await fetch(`${REL_SERVICE_URL}/blocked/me`, { headers: { Authorization: authHeader } });

    const bodyText = res.ok ? await res.text().catch(() => null) : null;
    const blockedText = resb.ok ? await resb.text().catch(() => null) : null;
    const blockedMeText = resBlockedMe.ok ? await resBlockedMe.text().catch(() => null) : null;

    
    friendList = bodyText ? JSON.parse(bodyText) : [];
    blockedList = blockedText ? JSON.parse(blockedText) : [];
    blockedMe = blockedMeText ? JSON.parse(blockedMeText) : [];
  } catch (e) {
    console.error('failed to fetch friends/blocked from relationship service', e && e.message ? e.message : e);
  }

  const blockedIds = new Set([
    ...(blockedList || []).map(extractBlockedIdFromBlockedEntry),
    ...(blockedMe || []).map(extractBlockedIdFromBlockedMeEntry)
  ]);

  // merge friends and blocked users so blocked-only users are also shown in contacts
  const combinedMap = new Map();
  (friendList || []).forEach(f => {
    const id = String(f.friend_id || f.friendId || f.id || '');
    if (!id) return;
    combinedMap.set(id, { friend_id: id, _fromFriend: true });
  });
  (blockedList || []).forEach(b => {
    const id = extractBlockedIdFromBlockedEntry(b);
    if (!id) return;
    if (combinedMap.has(id)) {
      const entry = combinedMap.get(id);
      entry._blocked = true;
      combinedMap.set(id, entry);
    } else {
      combinedMap.set(id, { friend_id: id, _fromFriend: false, _blocked: true });
    }
  });
  (blockedMe || []).forEach(b => {
    const id = extractBlockedIdFromBlockedMeEntry(b);
    if (!id) return;
    if (combinedMap.has(id)) {
      const entry = combinedMap.get(id);
      entry._blocked = true;
      combinedMap.set(id, entry);
    } else {
      combinedMap.set(id, { friend_id: id, _fromFriend: false, _blocked: true });
    }
  });

  const combinedList = Array.from(combinedMap.values());

  const contacts = await Promise.all(combinedList.map(async (f) => {
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
    } catch (e) {
      console.error(' profile fetch error for', f.friend_id, ':', e && e.message ? e.message : e);
    }

    const displayName = username || String(f.friend_id).slice(0, 8);
    return {
      id: f.friend_id,
      username: displayName,
      avatar,
      status: 'offline',
      last_message: lastMsg?.content,
      last_message_time: lastMsg?.created_at,
      conversation_id: convo?.id,
      isBlocked: blockedIds.has(String(f.friend_id))
    };
  }));

  const filtered = contacts.filter(c => c !== null);
  try { console.log('returning contacts count:', filtered.length); } catch (e) {}
  return reply.send(filtered);
}

export async function searchContacts(request, reply) {
  const userId = String(request.params.userId);
  const query = String(request.query.q || '').toLowerCase();
  const authHeader = request.headers.authorization || '';

  let friendList = [];
  let blockedList = [];
  let blockedMe = [];
  try {
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    const resb = await fetch(`${REL_SERVICE_URL}/blocked`, { headers: { Authorization: authHeader } });
    const resBlockedMe = await fetch(`${REL_SERVICE_URL}/blocked/me`, { headers: { Authorization: authHeader } });

    const bodyText = res.ok ? await res.text().catch(() => null) : null;
    const blockedText = resb.ok ? await resb.text().catch(() => null) : null;
    const blockedMeText = resBlockedMe.ok ? await resBlockedMe.text().catch(() => null) : null;

    
    friendList = bodyText ? JSON.parse(bodyText) : [];
    blockedList = blockedText ? JSON.parse(blockedText) : [];
    blockedMe = blockedMeText ? JSON.parse(blockedMeText) : [];
  } catch (e) {
    console.error('failed to fetch friends/blocked from relationship service', e && e.message ? e.message : e);
  }

  const blockedIds = new Set([
    ...(blockedList || []).map(extractBlockedIdFromBlockedEntry),
    ...(blockedMe || []).map(extractBlockedIdFromBlockedMeEntry)
  ]);

  // build combined map to include friends and blocked-only users 
  const combinedMap = new Map();
  (friendList || []).forEach(f => {
    const id = String(f.friend_id || f.friendId || f.id || '');
    if (!id) return;
    combinedMap.set(id, { friend_id: id, _fromFriend: true });
  });
  (blockedList || []).forEach(b => {
    const id = extractBlockedIdFromBlockedEntry(b);
    if (!id) return;
    if (combinedMap.has(id)) {
      const entry = combinedMap.get(id);
      entry._blocked = true;
      combinedMap.set(id, entry);
    } else {
      combinedMap.set(id, { friend_id: id, _fromFriend: false, _blocked: true });
    }
  });
  (blockedMe || []).forEach(b => {
    const id = extractBlockedIdFromBlockedMeEntry(b);
    if (!id) return;
    if (combinedMap.has(id)) {
      const entry = combinedMap.get(id);
      entry._blocked = true;
      combinedMap.set(id, entry);
    } else {
      combinedMap.set(id, { friend_id: id, _fromFriend: false, _blocked: true });
    }
  });

  const combinedList = Array.from(combinedMap.values());

  const enriched = await Promise.all(combinedList.map(async (f) => {
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
    } catch (e) {}

    const displayName = username || String(f.friend_id).slice(0, 8);
    return {
      id: f.friend_id,
      username: displayName,
      avatar,
      status: 'offline',
      last_message: lastMsg?.content,
      conversation_id: convo?.id,
      isBlocked: blockedIds.has(String(f.friend_id))
    };
  }));

  const filtered = enriched.filter(c => c && (
    String(c.id).toLowerCase().includes(query) ||
    String(c.username).toLowerCase().includes(query)
  ));
  return reply.send(filtered);
}