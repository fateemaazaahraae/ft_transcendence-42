import { Server } from "socket.io";
import { getDb } from "./db.js";
import GameRoom from "./GameRoom.js";
import Fastify from 'fastify';
// const fastifyCors = require('@fastify/cors');


// const fastify = Fastify({ logger: true });
const waitingQueue = [];

const pendingGames = new Map();

const getUserDataFromToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
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


export const GameLogic = (server) => {

    const io = new Server(server, { cors: { origin: "*" }, methods: ["GET", "POST"] });
    
    io.on('connection', (socket) => {
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
        socket.data.userId = userData.id; // Keep this for backward compatibility

        console.log(`🔌 User ${userData.name} connected!`);

        // socket.data.userId = userId;

        socket.on("leave_queue", () => {
        const index = waitingQueue.findIndex(
            s => s.data.userId === socket.data.userId
        );
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            console.log(`${socket.data.userId} removed from queue (leave_queue)`);
        }
        });


        socket.on("join_queue", () => {
            const userId = socket.data.userId;

            const alreadyQueued = waitingQueue.some(
                s => s.data.userId === userId
            );

            if (alreadyQueued) {
                console.log(`${userId} already in queue, successfuly ignored hh`);
                return;
            }

            waitingQueue.push(socket);

            if (waitingQueue.length >= 2) {
                const player1 = waitingQueue.shift();
                const player2 = waitingQueue.shift();

                if (player1.data.userId === player2.data.userId) {
                return;
                }

                const matchId = `match_${Date.now()}`;

                const matchInfo = {
                matchId,
                player1: player1.data.user,
                player2: player2.data.user
                };

                console.log(`🚀 Match: ${matchInfo.player1.avatar} vs ${matchInfo.player2.avatar}`);

                player1.emit("match_found", matchInfo);
                player2.emit("match_found", matchInfo);

                const game = new GameRoom(io, matchId, player1, player2);
                game.start();
            }
        });

        // Handle someone invite for a game
        socket.on("join_game", ({ gameId } = {}) => {
            try {
                if (!gameId) return;
                console.log(`[game] join_game ${gameId} by ${socket.data.userId}`);

                const pending = pendingGames.get(gameId);
                if (pending && pending.socket && pending.socket.id !== socket.id) {
                    clearTimeout(pending.timeout);
                    pendingGames.delete(gameId);

                    const player1Socket = pending.socket;
                    const player2Socket = socket;

                    const matchInfo = {
                        matchId: gameId,
                        player1: player1Socket.data.user,
                        player2: player2Socket.data.user
                    };

                    console.log(`[game] Invite match found for ${gameId}: ${player1Socket.data.userId} vs ${player2Socket.data.userId}`);

                    try { player1Socket.emit("match_found", matchInfo); } catch (e) {}
                    try { player2Socket.emit("match_found", matchInfo); } catch (e) {}

                    const game = new GameRoom(io, gameId, player1Socket, player2Socket);
                    game.start();
                    return;
                }

                // otherwise store this socket as pending, set a timeout to clear stale entries
                const timeout = setTimeout(() => {
                    try {
                        const p = pendingGames.get(gameId);
                        if (p && p.socket && p.socket.id === socket.id) {
                            pendingGames.delete(gameId);
                            try { socket.emit("game_join_timeout", { gameId }); } catch (e) {}
                        }
                    } catch (e) {}
                }, 30 * 1000);

                pendingGames.set(gameId, { socket, timeout });
            } catch (e) {
                console.warn('join_game handler error', e);
            }
        });

        socket.on('disconnect', () => {
            console.log(`user disconnected: ${socket.data.userId}`);

            const index = waitingQueue.findIndex(s => s.id === socket.id);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log(`${socket.data.userId} removed from queue bslama`);
            }

            for (const [gameId, entry] of pendingGames.entries()) {
                if (entry.socket && entry.socket.id === socket.id) {
                    clearTimeout(entry.timeout);
                    pendingGames.delete(gameId);
                }
            }
        });
    });
}