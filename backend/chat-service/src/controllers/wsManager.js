import { Server } from "socket.io";
import history from "../services/history.js";
import Blocked from "../models/blocked.js";
import jwt from "jsonwebtoken";
import GameRoom from "./gameinvite.js";


export let socket = null;
const onlineUsers = new Map();
// suppression map to prevent immediate re-online events after we emit offline due to block
const reonlineSuppress = new Map(); // key -> expiry timestamp

export function suppressReonline(recipientId, targetId, durationMs = 3000) {
  try {
    const key = `${recipientId}:${targetId}`;
    const expiry = Date.now() + durationMs;
    reonlineSuppress.set(key, expiry);
    // schedule cleanup
    setTimeout(() => { try { reonlineSuppress.delete(key); } catch(e) {} }, durationMs + 50);
    console.log('[presence] suppressReonline set', key, 'until', new Date(expiry).toISOString());
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
    
    // console.log("*********************  succesfully got the pic and data");
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
    console.log('[ws] connection from socket', socket.id, 'user=', userId);

    //friend accepted
    // io

  if (!userId) {
    console.log(" NO USER ID");
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
              console.log('[presence] snapshot - filtering out', other, 'for', userId);
            }
        } catch (e) {}
      }
      socket.emit("online_users", visible);
      console.log('[presence] sent online_users', userId, visible);
    } catch (e) {
      console.warn('online_users snapshot error', e);
    }

    const current = onlineUsers.get(userId) || new Set();
    current.add(socket.id);
    onlineUsers.set(userId, current);

    // only emit user_online when the first socket for this user connects
    if (current.size === 1) {
      console.log('[presence] user_online emit for', userId, 'onlineCount=', current.size);
      try {
        // emit user_online only to users who may see this user's presence
        for (const [otherId, socketset] of onlineUsers.entries()) {
          if (String(otherId) === String(userId)) continue;
          try {
            const allowed = await canSeePresence(otherId, userId);
            if (!allowed) {
              console.log('[presence] skipping user_online to', otherId, 'about', userId, '(blocked)');
              continue;
            }
            if (isReonlineSuppressed(otherId, userId)) {
              console.log('[presence] skipping user_online to', otherId, 'about', userId, '(suppressed)');
              continue;
            }
            console.log('[presence] emitting user_online to', otherId, 'about', userId);
            io.to(String(otherId)).emit("user_online", { userId });
          } catch (e) { console.warn('[presence] per-recipient emit error', e); }
        }
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
        
        // Send a notification to notification-service (fire-and-forget, non-blocking)


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

      const payload = {
        type: "game_start",
        gameId,
        gameType: "pong"
      };

      // notify both players
      socket.emit("game_start", payload);          // receiver
      socket.to(String(from)).emit("game_start", payload); // sender
    });


//   socket.on("StartInviteGame", (data) => {
//     const player1Id = data.player1;
//     const player2Id = data.player2;

//     console.log(`Received invite: P1: ${player1Id}, P2: ${player2Id}`);

//     if (player1Id === player2Id) return;

//     // 1. IDENTIFY PLAYER 1 (The Sender)
//     // If the sender IS player 1, we just use 'socket' directly.
//     // If you want to be safe, you can verify: if (socket.data.userId !== player1Id) return;
//     const player1Socket = socket; 

//     // 2. FIND PLAYER 2 (The Target)
//     let player2Socket = null;

//     for (const [_, s] of io.sockets.sockets) {
//         if (s.data.userId === player2Id) {
//             player2Socket = s;
//             break; 
//         }
//     }

//     // 3. CRITICAL: CHECK IF PLAYER 2 IS ONLINE
//     if (!player2Socket) {
//         console.log(`❌ Error: Player 2 (${player2Id}) is not connected.`);
//         // Optional: Tell Player 1 that Player 2 is offline
//         player1Socket.emit("game_error", { message: "Player 2 is offline" });
//         return; // <--- STOP HERE to prevent the crash
//     }

//     // 4. START THE MATCH
//     const matchId = `match_${Date.now()}`;
//     const matchInfo = { matchId, player1: player1Id, player2: player2Id };

//     console.log(`🚀 Match Started: ${matchInfo.player1} vs ${matchInfo.player2}`);

//     player1Socket.emit("match_found", matchInfo);
//     player2Socket.emit("match_found", matchInfo);

//     const game = new GameRoom(io, matchId, player1Socket, player2Socket);
//     game.start();
// });

    // // forward block notifications to the blocked user
    // socket.on('user_blocked', (payload) => {
    //   try {
    //     const { blockedId, blockerId } = payload || {};
    //     if (!blockedId) return;
    //     // validate emitter is the claimed blocker
    //     if (String(socket.data.userId) !== String(blockerId)) {
    //       console.warn('user_blocked: emitter userId mismatch', socket.data.userId, blockerId);
    //       return;
    //     }
    //     socket.to(String(blockedId)).emit('you_were_blocked', { by: blockerId });

    //     socket.to(String(blockerId)).emit('block_done', { target: blockedId });
  
    //   } catch (e) {
    //     console.warn('user_blocked handler error', e);
    //   }
    // });

    //         io.to(String(blockerId)).emit('block_done', { target: blockedId });
    //     socket.on('user_unblocked', (payload) => {
    //   try {
    //     const { unblockedId, unblockedBy } = payload || {};
    //     if (!unblockedId) return;
    //     if (String(socket.data.userId) !== String(unblockedBy)) {
    //       console.warn('user_unblocked: emitter mismatch', socket.data.userId, unblockedBy);
    //       return;
    //     }
    //     socket.to(String(unblockedId)).emit('you_were_unblocked', { by: unblockedBy });
    //       io.to(String(unblockedBy)).emit('unblock_done', { target: unblockedId });
    //   } catch (e) {
    //     console.warn('user_unblocked handler error', e);
    //   }
    // });


    socket.on("disconnect", async () => {
      try {
        const s = onlineUsers.get(userId);
        if (s) {
          s.delete(socket.id);
          if (s.size === 0) {
            onlineUsers.delete(userId);
            console.log('[presence] user_offline emit for', userId);
            try {
              // emit user_offline only to users who may see this user's presence
              for (const [otherId] of onlineUsers.entries()) {
                if (String(otherId) === String(userId)) continue;
                try {
                  const allowed = await canSeePresence(otherId, userId);
                  if (!allowed) {
                    console.log('[presence] skipping user_offline to', otherId, 'about', userId, '(blocked)');
                    continue;
                  }
                  // do not suppress offline emits; just send them
                  console.log('[presence] emitting user_offline to', otherId, 'about', userId);
                  io.to(String(otherId)).emit("user_offline", { userId });
                } catch (e) { console.warn('[presence] per-recipient emit error', e); }
              }
            } catch (e) { console.warn('presence emit error', e); }
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
