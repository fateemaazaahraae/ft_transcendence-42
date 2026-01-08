import { Server } from "socket.io";
import { getDb } from "./db.js";
import GameRoom from "./GameRoom.js";
import Fastify from 'fastify';
// const fastifyCors = require('@fastify/cors');


// const fastify = Fastify({ logger: true });
const waitingQueue = [];

const getUserDataFromToken = (token) => { // had lfunction kayreturni id&name&img of user from the token
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    console.log("*********************  succesfully got the pic and data");
    return {
        id: decoded.id,
        name: decoded.userName,       // Make sure these match your JWT fields
        avatar: decoded.profileImage || "/public/default.png" // Fallback
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

        socket.on("leave_queue", () => {
        // waitingQueue = waitingQueue.filter(p => p.userId !== socket.userId);
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
            socket.emit("waiting_for_match", {
            message: "Waiting for opponent..."
            });
        }
        });
        socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.data.userId}`);

        const index = waitingQueue.findIndex(s => s.id === socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);// splice (index) from where start removing and (1) how many to remove
            console.log(`${socket.data.userId} removed from queue bslama`);
        }
        });
    });
}
