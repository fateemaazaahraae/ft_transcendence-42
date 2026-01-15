// import { Socket } from "node:dgram";
import { io, Socket } from "socket.io-client";
import { getActiveChatUser } from "../pages/chatHelpers";


// const redis = new Redis(process.env.REDIS_URL);

// global.io = io;
export let socket: Socket | null = null;
let currentUserId: string | number | null = null;

// Connection state and message queue for offline-safe sending
let connected = false;
type Queued = { to: string | number; message: string; ack?: (res: any) => void };
const messageQueue: Queued[] = [];
const connectionSubscribers: Array<(isConnected: boolean) => void> = [];
const messageListeners: Array<(data: any) => void> = [];
const blockListeners: Array<(data: any) => void> = [];
const presenceListeners: Array<(userId: string, status: 'online' | 'offline') => void> = [];
const profileListeners: Array<(payload: any) => void> = [];


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

    // connect to chat service
    
    const opts: any = {
        transports: ["websocket", "polling"],
        withCredentials: false,
        auth: { token: token ? String(token).replace(/^Bearer\s+/i, '') : undefined },
        path: '/ws/socket.io'
    };

    // increase timeout and prefer polling first to avoid initial websocket timeout
    opts.transports = ["polling", "websocket"];
    opts.timeout = 20000; // 20s connection timeout
    opts.reconnectionAttempts = Infinity;

    socket = io(serverUrl, opts);


    // friend accepted 
    socket.on("connect", () => {
       
        
        connected = true;
        // notify subscribers
        connectionSubscribers.forEach(cb => {
            try { cb(true); } catch (e) { console.warn('connection subscriber error', e); }
        });

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

    
    socket.on("user_online", ({ userId }) => {
        
        presenceListeners.forEach(cb => {
            try { cb(String(userId), 'online'); } catch (e) { console.warn('presence listener error', e); }
        });
    });
    socket.on("user_offline", ({ userId }) => {
        // console.log('DBG recv user_offline', userId);
        presenceListeners.forEach(cb => {
            try { cb(String(userId), 'offline'); } catch (e) { console.warn('presence listener error', e); }
        });
    });


    // receive initial snapshot of online users
        socket.on("online_users", (userIds: string[]) => {
            

            userIds.forEach((id) => {
                presenceListeners.forEach(cb => {
                    try {
                        cb(String(id), "online");
                    } catch (e) {
                        console.warn("presence snapshot listener error", e);
                    }
                });
            });
        });


        socket.on(
        "accept_game_invite",
        ({ roomId }: { roomId: string }) => {
            console.log("[game] invite accepted, room:", roomId);

            socket.join(roomId);

            socket.to(roomId).emit("start_game", { roomId });
            socket.emit("start_game", { roomId });
        }
        );



    socket.on("new_message", (data: any) => {
    messageListeners.forEach(cb => {
        try { cb(data); } catch (e) {
            console.warn("message listener error", e);
        }
    });
    });

    // profile/avatar updates
    socket.on('profile_updated', (payload: any) => {
        try {
            
            profileListeners.forEach(cb => {
                try { cb(payload); } catch (e) { console.warn('profile listener callback failed', e); }
            });
        } catch (e) { console.warn('profile_updated handler failed', e); }
    });

  
    socket.on('friend_accepted', (payload: any) => {
                const friendId = payload?.friendId || payload?.userId || '';

        friendListeners.forEach(fn => {
            try { fn(String(friendId)); } catch (e) { console.warn('friend listener error', e); }
        });
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

export function listenForMessagesReceived(cb: (data: any) => void) {
    messageListeners.push(cb);
}

export function listenForBlockEvents(cb: (data: any) => void) {
    blockListeners.push(cb);
}

export function listenForProfileUpdates(cb: (payload: any) => void) {
    profileListeners.push(cb);
    return () => {
        const idx = profileListeners.indexOf(cb);
        if (idx !== -1) profileListeners.splice(idx, 1);
    };
}

//temporarly
export function listenForPresenceEvents(
  onOnline: (userId: string) => void,
  onOffline: (userId: string) => void
) {
    
    const handler = (userId: string, status: 'online' | 'offline') => {
        if (status === 'online') onOnline(String(userId));
        else onOffline(String(userId));
    };
    presenceListeners.push(handler);
    

    return () => {
        const idx = presenceListeners.indexOf(handler as any);
        if (idx !== -1) presenceListeners.splice(idx, 1);
    };
}

export function listenForPresence(cb: (userId: string, status: 'online' | 'offline') => void) {
    presenceListeners.push(cb);
    return () => {
        const idx = presenceListeners.indexOf(cb);
        if (idx !== -1) presenceListeners.splice(idx, 1);
    };
}


const friendListeners: Array<(userId: string) => void> = [];

export function listenForFriendAccepted(cb: (userId: string) => void) {
  friendListeners.push(cb);
}


