// import { Socket } from "node:dgram";
import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;
let currentUserId: string | number | null = null;

// Connection state and message queue for offline-safe sending
let connected = false;
type Queued = { to: string | number; message: string; ack?: (res: any) => void };
const messageQueue: Queued[] = [];
const connectionSubscribers: Array<(isConnected: boolean) => void> = [];

export function initializeSocket(userId: string | number, serverUrl: string, token?: string) {
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
    console.log('[sockeService] connecting to', serverUrl, 'with token?', !!token);
    // If serverUrl points to the proxied /ws path, set socket.io path accordingly
    const opts: any = {
        transports: ["websocket", "polling"],
        withCredentials: false,
        // send raw token (without Bearer prefix) in auth so server can normalize
        auth: { token: token ? String(token).replace(/^Bearer\s+/i, '') : undefined },
        // always use the proxied socket.io path so requests go through /ws
        path: '/ws/socket.io'
    };

    socket = io(serverUrl, opts);

    socket.on("connect", () => {
        console.log("socket connected", socket?.id, 'userId=', userId);
        connected = true;
        // notify subscribers
        connectionSubscribers.forEach(cb => {
            try { cb(true); } catch (e) { console.warn('connection subscriber error', e); }
        });

        try {
            socket?.emit("join", String(userId)); // Convert to string to match backend room format
            console.log('[sockeService] emitted join', String(userId));
        } catch (e) {
            console.warn('[sockeService] failed to emit join', e);
        }

        // flush queued messages
        while (messageQueue.length > 0 && socket && connected) {
            const q = messageQueue.shift();
            if (!q) break;
            try {
                const payload = { from: String(currentUserId), to: String(q.to), content: q.message };
                socket.emit('send_message', payload, (res: any) => {
                    if (q.ack) q.ack(res);
                });
            } catch (err) {
                console.warn('failed to send queued message, re-queueing', err);
                messageQueue.unshift(q);
                break;
            }
        }
    });

    socket.on("disconnect", (reason) => {
        console.log("socket disconnected", reason, 'socket id', socket?.id);
        connected = false;
        connectionSubscribers.forEach(cb => {
            try { cb(false); } catch (e) { console.warn('connection subscriber error', e); }
        });
    });

    socket.on("connect_error", (err) => {
        console.error("socket connect_error", err);
    });
}

export function sendMessage(receiverId: string | number, message: string, ack?: (res: any) => void) {
    if (currentUserId == null) {
        console.warn("cannot send: missing currentUserId");
        if (ack) ack({ status: 'error', reason: 'missing user' });
        return;
    }

    
    // if socket connected, emit immediately
    if (socket && connected && !socket.disconnected) {
        const payload = { from: String(currentUserId), to: String(receiverId), content: message };
        socket.emit("send_message", payload, (res: any) => {
            if (ack) ack(res);
        });
        return;
    }

    // otherwise queue the message and return queued ack
    console.warn("socket not connected, queuing message", { socketExists: !!socket, socketId: socket?.id, connected });
    messageQueue.push({ to: receiverId, message, ack });
    if (ack) ack({ status: 'queued' });
}

export function isConnected() { return connected; }

export function subscribeConnection(cb: (isConnected: boolean) => void) {
    connectionSubscribers.push(cb);
    // call immediately with current state
    try { cb(connected); } catch (e) { console.warn('subscribe immediate callback error', e); }
    return () => {
        const idx = connectionSubscribers.indexOf(cb);
        if (idx !== -1) connectionSubscribers.splice(idx, 1);
    };
    
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
