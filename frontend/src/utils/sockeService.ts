// import { Socket } from "node:dgram";
import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;
let currentUserId: number | null = null;

export function initializeSocket(userId: number, serverUrl: string) {
    currentUserId = userId;

    // clean previous socket before reconnecting
    if (socket) {
        try {
            socket.removeAllListeners();
            socket.disconnect();
        } catch (err) {
            console.warn("socket cleanup error", err);
        }
        socket = null;
    }

    // Connect to chat service
    socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        withCredentials: false,
    });

    socket.on("connect", () => {
        console.log("socket connected", socket?.id);
        socket?.emit("join", String(userId)); // Convert to string to match backend room format
    });

    socket.on("disconnect", (reason) => {
        console.log("socket disconnected", reason);
    });

    socket.on("connect_error", (err) => {
        console.error("socket connect_error", err);
    });
}

export function sendMessage(receiverId: number, message: string, ack?: (res: any) => void) {
    if (!socket || socket.disconnected) {
        console.warn("cannot send: socket not connected");
        return;
    }
    if (currentUserId == null) {
        console.warn("cannot send: missing currentUserId");
        return;
    }

    const payload = { from: String(currentUserId), to: String(receiverId), content: message };
    socket.emit("send_message", payload, (res: any) => {
        if (ack) ack(res);
    });
}

export function listenForMessagesReceived(callback: (data: any) => void) {
    if (!socket) {
        console.warn("socket not initialized");
        return;
    }

    socket.off("new_message");
    socket.on("new_message", (data: any) => {
        callback(data);
    });
}
