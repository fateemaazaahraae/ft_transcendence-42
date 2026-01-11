const onlineUsers = new Map(); // userId -> Set(socketId)

export function userConnected(userId, socketId) {
  const set = onlineUsers.get(userId) || new Set();
  set.add(socketId);
  onlineUsers.set(userId, set);
  return set.size === 1; // first connection
}

export function userDisconnected(userId, socketId) {
  const set = onlineUsers.get(userId);
  if (!set) return false;

  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(userId);
    return true; // last disconnect
  }
  return false;
}

export function isUserOnline(userId) {
  return onlineUsers.has(String(userId));
}

export function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}