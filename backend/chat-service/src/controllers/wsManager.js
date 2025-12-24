import { Server } from "socket.io";
import history from "../services/history.js";
import Conversation from '../models/conversation.js';
import Messages from '../models/messages.js';

export let socket = null;

export const initSocket = (server) => {
  socket = new Server(server, { path: "/ws/socket.io", cors: { origin: "*" }, transports: ["websocket", "polling"] });
 

  socket.on("connection", (socket) => {
    console.log("socket connected:", socket.id);
    
    socket.on("join", (userId) => {
      socket.join(userId);
      socket.data.userId = userId;
      console.log(`socket ${socket.id} joined room ${userId}`);
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

    socket.on("disconnect", () => console.log("socket disconnected"));
  });

  return socket;
};
