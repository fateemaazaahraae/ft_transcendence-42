import { Server } from "socket.io";
import history from "../services/history.js";
import jwt from "jsonwebtoken";


export let socket = null;
const onlineUsers = new Map();
export const initSocket = (server) => {
  const io = new Server(server, {
    path: "/ws/socket.io",
    cors: { origin: "*" }
  });

  // export the io instance for other modules if needed
  socket = io;

  io.on("connection", (socket) => {
    const rawToken =
      socket.handshake.headers?.authorization ||
      socket.handshake.auth?.token;

    if (!rawToken) {
      socket.disconnect(true);
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(
        rawToken.replace(/^Bearer\s+/i, ""),
        process.env.JWT_SECRET
      );
    } catch (err) {
      try { socket.emit('unauthorized'); } catch(e){}
      socket.disconnect(true);
      return;
    }

    const userId = decoded.id;
    socket.data.userId = userId;
    console.log('[ws] connection from socket', socket.id, 'user=', userId);

    // join personal room
    socket.join(userId);


    // send current online users to the newly connected client
    try {
      const onlineNow = Array.from(onlineUsers.keys()).filter(id => id !== userId);
      socket.emit("online_users", onlineNow);
      console.log('[presence] sent online_users snapshot to', userId, onlineNow);
    } catch (e) {
      console.warn('online_users snapshot error', e);
    }

    // maintain set of socket ids per user to handle multi-tab connections
    const current = onlineUsers.get(userId) || new Set();
    current.add(socket.id);
    onlineUsers.set(userId, current);

    // only emit user_online when the first socket for this user connects
    if (current.size === 1) {
      console.log('[presence] user_online emit for', userId, 'onlineCount=', current.size);
      try {
        socket.broadcast.emit("user_online", { userId });
      } catch (e) { console.warn('presence emit error', e); }
    }
    try { console.log('[presence] onlineUsers keys now:', Array.from(onlineUsers.keys())); } catch (e) {}
    socket.on("send_message", async (payload, ack) => {
      try {
        const { from, to, content } = payload;
        let authHeader = socket.handshake.headers?.authorization || socket.handshake.auth?.token || '';
        if (authHeader && !/^Bearer\s+/i.test(authHeader)) {
          authHeader = `Bearer ${authHeader}`;
        }
        const masked = authHeader ? (authHeader.length > 12 ? authHeader.slice(0,8) + '...' + authHeader.slice(-8) : '***') : '(no-token)';
        const { convo, msg } = await history.sendMessage(from, to, content, authHeader);
        socket.to(to).emit("new_message", { conversation: convo, message: msg });
        if (ack) ack({ status: "ok", message: msg });
      } catch (err) {
        console.warn(' send_message error', err.message || err);
        if (err.code === "BLOCKED") {
          if (ack) ack({ status: "error", reason: "blocked" });
          return;
        }
        if (err.code === "NOT_FRIEND") {
          if (ack) ack({ status: "error", reason: "not_friend" });
          return;
        }
        console.error(err);
        if (ack) ack({ status: "error", reason: "server_error" });
      }
    });

    // forward block notifications to the blocked user
    socket.on('user_blocked', (payload) => {
      try {
        const { blockedId, blockerId } = payload || {};
        if (!blockedId) return;
        // validate emitter is the claimed blocker
        if (String(socket.data.userId) !== String(blockerId)) {
          console.warn('user_blocked: emitter userId mismatch', socket.data.userId, blockerId);
          return;
        }
        socket.to(String(blockedId)).emit('you_were_blocked', { by: blockerId });
      } catch (e) {
        console.warn('user_blocked handler error', e);
      }
    });

    
        socket.on('user_unblocked', (payload) => {
      try {
        const { unblockedId, unblockedBy } = payload || {};
        if (!unblockedId) return;
        if (String(socket.data.userId) !== String(unblockedBy)) {
          console.warn('user_unblocked: emitter mismatch', socket.data.userId, unblockedBy);
          return;
        }
        socket.to(String(unblockedId)).emit('you_were_unblocked', { by: unblockedBy });
      } catch (e) {
        console.warn('user_unblocked handler error', e);
      }
    });


    socket.on("disconnect", () => {
      try {
        const s = onlineUsers.get(userId);
        if (s) {
          s.delete(socket.id);
          if (s.size === 0) {
            onlineUsers.delete(userId);
            console.log('[presence] user_offline emit for', userId);
            try { socket.broadcast.emit("user_offline", { userId }); } catch (e) { console.warn('presence emit error', e); }
          } else {
            onlineUsers.set(userId, s);
          }
        }
      } catch (e) {
        // don't let disconnect errors crash the server
        console.warn('disconnect handler error', e);
      }
      try { console.log('[presence] onlineUsers keys now:', Array.from(onlineUsers.keys())); } catch (e) {}
    });
  });

  return io;
};
