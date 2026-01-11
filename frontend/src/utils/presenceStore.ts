const onlineUsers = new Set<string>();

export function setUserOnline(userId: string) {
  onlineUsers.add(userId);
}

export function setUserOffline(userId: string) {
  onlineUsers.delete(userId);
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}
