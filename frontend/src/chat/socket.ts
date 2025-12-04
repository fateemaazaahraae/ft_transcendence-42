// src/socket.ts
import { io, Socket } from "socket.io-client";
// import type { MessagePayload, NewMessageEvent } from "./types";
import { NewMessageEvent } from "./types";

// const CHAT_URL = import.meta.env.VITE_CHAT_c'est URL;
let socket: Socket | null = null;

export function connectSocket(token: string) {
  socket = io(String(import.meta.env.VITE_CHAT_URL || "http://localhost:4000"), {
    auth: { token },
    transports: ["websocket"],
  });
  socket.on("connect_error", (err) => console.error("WS connect error", err));
  return socket;
}

export function join(userId: string) {
  socket?.emit("join", { userId });
}

export function sendMessage(to: string, content: string): Promise<any> {
  return new Promise((resolve) => {
    socket?.emit("send_message", { to, content }, (resp: any) => {
      resolve(resp);
    });
  });
}

export function onNewMessage(cb: (payload: NewMessageEvent) => void) {
  socket?.on("new_message", cb);
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
