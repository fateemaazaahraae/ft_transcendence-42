import { Server } from "socket.io";
import history from "../services/history.js";
import Conversation from '../models/conversation.js';
import Messages from '../models/messages.js';

export let socket = null;

export const initSocket = (server) => {
  socket = new Server(server, { path: "/ws/socket.io", cors: { origin: "*" }, transports: ["websocket", "polling"] });
 

  socket.on("connection", (socket) => {
    
    
    socket.on("join", (userId) => {
      socket.join(userId);
      socket.data.userId = userId;
      
    });

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


    socket.on("disconnect", () => {});
  });

  return socket;
};
