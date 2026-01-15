import { Server } from "socket.io";
import history from "../services/history.js";
import Blocked from "../models/blocked.js";
import jwt from "jsonwebtoken";


export let socket = null;
const onlineUsers = new Map();
const reonlineSuppress = new Map(); 

export function suppressReonline(recipientId, targetId, durationMs = 3000) {
  try {
    const key = `${recipientId}:${targetId}`;
    const expiry = Date.now() + durationMs;
    reonlineSuppress.set(key, expiry);
    // schedule cleanup
    setTimeout(() => { try { reonlineSuppress.delete(key); } catch(e) {} }, durationMs + 50);
  } catch (e) {
    console.warn('suppressReonline error', e);
  }
}

function isReonlineSuppressed(recipientId, targetId) {
  try {
    const key = `${recipientId}:${targetId}`;
    const expiry = reonlineSuppress.get(key);
    if (!expiry) return false;
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
}
export const initSocket = (server) => {
  const io = new Server(server, {
    path: "/ws/socket.io",
    cors: { origin: "*" }
  });

  const getUserDataFromToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    return {
        id: decoded.id,
        name: decoded.userName,       // Make sure these match your JWT fields
        avatar:
            decoded.profileImage ??
            decoded.avatar ??
            "/public/default.png"
        // avatar: decoded.profileImage || "/public/default.png" // Fallback
    };
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return null;
  }
};
  // export the io instance for other modules if needed
  socket = io;

  io.on("connection", async (socket) => {
      const token = socket.handshake.auth.token;
        if (!token) { // check tocken (JWT)
            console.log('❌ Connection rejected: No token provided.');
            socket.disconnect();
            return;
        }

        const userData = getUserDataFromToken(token);
        
        if (!userData) {
            socket.disconnect();
            return;
        }


        socket.data.user = userData; 
        socket.data.userId = userData.id
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
    

    //friend accepted
    // io

  if (!userId) {
    return;
  }

  socket.join(String(userId));
  console.log(" USER JOINED ROOM", userId);
  
  async function canSeePresence(a, b) {
      try {
        const [aBlockedB, bBlockedA] = await Promise.all([
          Blocked.isBlocked('', String(a), String(b)),
          Blocked.isBlocked('', String(b), String(a))
        ]);
        return !(aBlockedB || bBlockedA);
      } catch (e) {
        
        console.warn('canSeePresence error', e);
        return true;
      }
    }

    // send current online users to the newly connected client 
    try {
      const otherIds = Array.from(onlineUsers.keys()).filter(id => id !== userId);
      const visible = [];
      for (const other of otherIds) {
        // only include if both sides can see each other
        try {
            if (await canSeePresence(userId, other)) {
              visible.push(other);
            } else {
              // filtered from presence snapshot
            }
        } catch (e) {}
      }
      socket.emit("online_users", visible);
    } catch (e) {
      console.warn('online_users snapshot error', e);
    }

    const current = onlineUsers.get(userId) || new Set();
    current.add(socket.id);
    onlineUsers.set(userId, current);

    // only emit user_online when the first socket for this user connects
    if (current.size === 1) {
      try {
        // emit user_online only to users who may see this user's presence
        for (const [otherId, socketset] of onlineUsers.entries()) {
          if (String(otherId) === String(userId)) continue;
          try {
            const allowed = await canSeePresence(otherId, userId);
            if (!allowed) {
              continue;
            }
            if (isReonlineSuppressed(otherId, userId)) {
              continue;
            }
            io.to(String(otherId)).emit("user_online", { userId });
          } catch (e) { console.warn('[presence] per-recipient emit error', e); }
        }
      } catch (e) { console.warn('presence emit error', e); }
    }
    

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
        
        
        // send a notification to notification-service 

        try {
          const AUTH_URL = process.env.API_URL || 'http://auth-service:3000';
          const pr = await fetch(`${AUTH_URL.replace(/\/$/, '')}/users/${from}`, {
            headers: authHeader ? { Authorization: authHeader } : {}
          }).catch(() => null);
          const senderName = pr && pr.ok ? (await pr.json().catch(() => ({}))).userName || '' : '';

          const NOTIF_URL = process.env.NOTIF_URL || 'http://notification-service:3005';
          const notificationBody = {
            userId: String(to),
            type: 'MESSAGE',
            payload: {
              fromUserId: String(from),
              fromUserName: senderName,
              conversationId: convo?.id,
              message: content
            }
          };

          fetch(`${NOTIF_URL.replace(/\/$/, '')}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationBody)
          }).catch((e) => console.warn('notification post failed', e));
        } catch (e) {
          console.warn('notification send error', e);
        }






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

    socket.on("send_game_invite", async (payload, ack) => {
      try {
        const { to, gameType = "pong" } = payload;
        const from = socket.data.userId;

        if (!to || !from) {
          ack?.({ status: "error", reason: "invalid_payload" });
          return;
        }

        // simple invite id (not a game room yet)
        const inviteId = `${from}_${to}_${Date.now()}`;

        const inviteMessage = {
          type: "game_invite",
          from,
          to,
          inviteId,
          gameType
        };

        // receiver
        socket.to(String(to)).emit("new_message", inviteMessage);

        // sender (so it appears in chat)
        socket.emit("new_message", inviteMessage);

        ack?.({ status: "ok", inviteId });
      } catch (err) {
        console.error("[chat] send_game_invite error", err);
        ack?.({ status: "error", reason: "server_error" });
      }
    });


    socket.on("accept_game_invite", ({ inviteId, from, to }) => {
      const accepter = socket.data.userId;

      // 🔒 SECURITY: only receiver can accept
      if (String(accepter) !== String(to)) {
        console.warn("[game] non-receiver tried to accept invite", accepter, to);
        return;
      }

      console.log("[game] invite accepted by receiver", accepter, inviteId);

      // reuse inviteId as gameId for simplicity
      const gameId = inviteId;

      // Build a full payload including a match object and explicit player ids
      // so clients can persist currentMatch and fetch player settings.
      const matchInfo = {
        gameId,
        player1: { id: String(from) },
        player2: { id: String(to) }
      };

      const payload = {
        type: "game_start",
        gameId,
        gameType: "pong",
        match: matchInfo,
        // keep these top-level fields for backward compatibility with clients
        player1: String(from),
        player2: String(to)
      };

      // notify both players (receiver and the original inviter)
      try {
        socket.emit("game_start", payload); // receiver (accepter)
      } catch (e) { console.warn("[game] emit to receiver failed", e); }
      try {
        socket.to(String(from)).emit("game_start", payload); // sender (inviter)
      } catch (e) { console.warn("[game] emit to inviter failed", e); }
    });

    socket.on("disconnect", async () => {
      try {
        const s = onlineUsers.get(userId);
        if (s) {
          s.delete(socket.id);
          if (s.size === 0) {
            onlineUsers.delete(userId);
            
            try {
              for (const [otherId] of onlineUsers.entries()) {
                if (String(otherId) === String(userId)) continue;
                try {
                  const allowed = await canSeePresence(otherId, userId);
                  if (!allowed) {
                    continue;
                  }
                  // do not suppress offline emits just send them
                  io.to(String(otherId)).emit("user_offline", { userId });
                } catch (e) { console.warn('[presence] per-recipient emit error', e); }
              }
            } catch (e) { console.warn('presence emit error', e); }
          } else {
            onlineUsers.set(userId, s);
          }
        }
      } catch (e) {
        console.warn('disconnect handler error', e);
      }
      try { console.log('[presence] onlineUsers keys now:', Array.from(onlineUsers.keys())); } catch (e) {}
    });
  });

  return io;
};