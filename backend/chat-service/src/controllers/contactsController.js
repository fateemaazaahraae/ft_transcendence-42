import db from '../config/db.js';
// history service not used directly here; keep DB import

const API_URL = process.env.API_URL || 'http://auth-service:3000';
const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

export async function getContacts(request, reply) {
  const userId = String(request.user.id);
  const authHeader = request.headers.authorization || '';
  let friendList = [];
  let blockedList = [];
  try {
    if (!authHeader) {
        return reply.status(401).send([]);
      }
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    const resb = await fetch(`${REL_SERVICE_URL}/blocked`, { headers: { Authorization: authHeader } });

    console.log(' fetched /friends status:', res.status);
    console.log(' fetched /blocked status:', resb.status);

    const blockedText = await resb.text().catch(() => null);
    try { console.log(' /blocked raw body:', blockedText && blockedText.substring ? blockedText.substring(0, 500) : blockedText); } catch (e) {}
    const bodyText = await res.text().catch(() => null);
    try { console.log(' /friends raw body:', bodyText && bodyText.substring ? bodyText.substring(0, 500) : bodyText); } catch (e) {}
    if (res.ok) {
      try {
        friendList = bodyText ? JSON.parse(bodyText) : [];
      } catch (e) {
        console.error(' failed to parse /friends JSON', e);
        friendList = [];
      }
    } else {
      console.warn('relationship service returned', res.status);
    }
    if (resb.ok) {
      try {
        blockedList = blockedText ? JSON.parse(blockedText) : [];
      } catch (e) {
        console.error(' failed to parse /blocked JSON', e);
        blockedList = [];
      }
    } else {
      console.warn('relationship service returned', resb.status);
    }
  } catch (e) {
    console.error('failed to fetch friends from relationship service', e.message);
  }

const blockedIds = new Set(
  (blockedList || []).map(b => String(
    b.blocked_user_id || b.blockedId || b.blocked_user || b.id
  ))
);

  // Merge friends and blocked users so blocked-only users are also shown in contacts
  const combinedMap = new Map();
  (friendList || []).forEach(f => {
    const id = String(f.friend_id || f.friendId || f.id);
    if (!id) return;
    combinedMap.set(id, { friend_id: id, _fromFriend: true });
  });
  (blockedList || []).forEach(b => {
    const id = String(b.blocked_user_id || b.blockedId || b.blocked_user || b.id);
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
      } else {
        // profile fetch failed
        console.warn(' user profile fetch failed ');
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
      conversation_id: convo?.id,
        isBlocked: blockedIds.has(String(f.friend_id))

      // relationType: 
      
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
  try {
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    const resb = await fetch(`${REL_SERVICE_URL}/blocked`, { headers: { Authorization: authHeader } });//added now
    if (res.ok) friendList = await res.json();
    if (resb.ok) blockedList = await resb.json();
    else console.warn('relationship service returned', res.status);
  } catch (e) {
    console.error('failed to fetch friends from relationship service', e.message);
  }

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
    
    const blockedIds = new Set((blockedList || []).map(b => String(b.blocked_user_id || b.blockedId || b.blocked_user || b.id))); 
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