import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getGameSocket = (token: string | null): Socket => {
  if (socket && socket.connected) {  // socket exists and connected, return it.
    return socket;
  }
  // else create new connection
  socket = io("http://localhost:3003", {
    auth: {
      token: token
    }
  });

  return socket;
};

export const disconnectGameSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};