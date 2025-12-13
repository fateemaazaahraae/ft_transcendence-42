import { Server } from "socket.io";
import history from "../services/history.js";

export let io = null;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" }, transports: ["websocket", "polling"] });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);
    
    socket.on("join", (userId) => {
      socket.join(userId);
      socket.data.userId = userId;
      console.log(`socket ${socket.id} joined room ${userId}`);
    });

    socket.on("send_message", (payload, ack) => {
      try {
        const { from, to, content } = payload;
        const { convo, msg } = history.sendMessage(from, to, content);
        io.to(to).emit("new_message", { conversation: convo, message: msg });
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

  return io;
};