import { Server } from "socket.io";
import { getDb } from "./db.js";
import GameRoom from "./GameRoom.js";
import Fastify from 'fastify';
// const fastifyCors = require('@fastify/cors');


// const fastify = Fastify({ logger: true });
const waitingQueue = [];

// Add pending games map so invite-based games (chat invite ids) can be matched:
// key: gameId (inviteId), value: { socket, timeout }
const pendingGames = new Map();

const getUserDataFromToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    // console.log("*********************  succesfully got the pic and data");
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
        // console.log(`User connected! Socket ID: ${socket.id} | User ID: ${socket.data.userId}`);

        socket.on("leave_queue", () => {
        const index = waitingQueue.findIndex(
            s => s.data.userId === socket.data.userId
        );
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            console.log(`${socket.data.userId} removed from queue (leave_queue)`);
        }
        });

        socket.on("save-ai-match", async (data) => {
            console.log(`this player: ${data.userId} wins againset Ai ------------`);
            try {
                const db = await getDb();

                await db.run(
                `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
                [data.userId]
                );

                await db.run(
                `UPDATE wlxp
                SET XPoints = XPoints + 30
                WHERE id = ?`,
                [data.userId]
                );
                
                console.log("✅ Match vs Ai is saved to SQLite database!");
            } catch (error) {
                console.error("❌ Failed to save Ai match:", error);
            }
        })


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
            console.log(`${userId} joined the queue. queue size===:${waitingQueue.length}===`);

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
            } else {
                console.log("Waiting for players...");
            }
        });

        // Handle invite-based games: clients navigate to /pong/:gameId and emit "join_game"
        socket.on("join_game", ({ gameId } = {}) => {
            try {
                if (!gameId) return;
                console.log(`[game] join_game ${gameId} by ${socket.data.userId}`);

                // If there's already a pending socket waiting for this gameId, pair them
                const pending = pendingGames.get(gameId);
                if (pending && pending.socket && pending.socket.id !== socket.id) {
                    // cancel timeout for pending
                    clearTimeout(pending.timeout);
                    pendingGames.delete(gameId);

                    const player1Socket = pending.socket;
                    const player2Socket = socket;

                    // Build matchInfo similar to other flows (player objects)
                    const matchInfo = {
                        matchId: gameId,
                        player1: player1Socket.data.user,
                        player2: player2Socket.data.user
                    };

                    console.log(`[game] Invite match found for ${gameId}: ${player1Socket.data.userId} vs ${player2Socket.data.userId}`);

                    // notify both sockets (optional)
                    try { player1Socket.emit("match_found", matchInfo); } catch (e) {}
                    try { player2Socket.emit("match_found", matchInfo); } catch (e) {}

                    // create GameRoom and start
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
                            console.log(`[game] pending join for ${gameId} timed out for ${socket.data.userId}`);
                        }
                    } catch (e) {}
                }, 30 * 1000); // 30s timeout

                // Overwrite any existing same-socket pending entry (defensive)
                pendingGames.set(gameId, { socket, timeout });
                console.log(`[game] stored pending join for ${gameId} from ${socket.data.userId}`);
            } catch (e) {
                console.warn('join_game handler error', e);
            }
        });

        // Ensure pendingGames cleaned up when socket disconnects
        socket.on('disconnect', () => {
            console.log(`user disconnected: ${socket.data.userId}`);

            // remove from waitingQueue if present
            const index = waitingQueue.findIndex(s => s.id === socket.id);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log(`${socket.data.userId} removed from queue bslama`);
            }

            // cleanup pendingGames entries referencing this socket
            for (const [gameId, entry] of pendingGames.entries()) {
                if (entry.socket && entry.socket.id === socket.id) {
                    clearTimeout(entry.timeout);
                    pendingGames.delete(gameId);
                    console.log(`[game] cleaned pending entry ${gameId} due to disconnect of ${socket.data.userId}`);
                }
            }
        });
    });
}