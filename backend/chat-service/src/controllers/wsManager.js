import { Server } from "socket.io";
import history from "../services/history.js";
import Conversation from '../models/conversation.js';
import Messages from '../models/messages.js';

export let socket = null;

export const initSocket = (server) => {
  socket = new Server(server, { cors: { origin: "*" }, transports: ["websocket", "polling"] });

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
    // const convo = Conversation.findOrCreate(from, to);
    // const msg = Messages.create(convo.id, from, content);
    const { convo, msg } = await history.sendMessage(from, to, content, null);
    socket.to(to).emit("new_message", { conversation: convo, message: msg });
        if (ack) ack({ status: "ok", message: msg });
      } catch (err) {
        if (err.code === "BLOCKED") {
          if (ack) ack({ status: "error", reason: "blocked" });
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
