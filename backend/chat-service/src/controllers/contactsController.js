import '../config/db.js';
import '../services/history.js';


const API_URL = process.env.API_URL || 'http://auth-service:3000';
const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

export async function getContacts(request, reply) {
  const userId = String(request.params.userId);
  const authHeader = request.headers.authorization || '';
  let friendList = [];
  try {
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    if (res.ok) friendList = await res.json();
    else console.warn('relationship service returned', res.status);
  } catch (e) {
    console.error('failed to fetch friends from relationship service', e.message);
  }

  const contacts = await Promise.all(friendList.map(async (f) => {
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
}

export async function searchContacts(request, reply) {
  const userId = String(request.params.userId);
  const query = String(request.query.q || '').toLowerCase();
  const authHeader = request.headers.authorization || '';

  let friendList = [];
  try {
    const res = await fetch(`${REL_SERVICE_URL}/friends`, { headers: { Authorization: authHeader } });
    if (res.ok) friendList = await res.json();
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
}