import { Server } from "socket.io";
// import { getDb } from "./db.js";

const waitingQueue = [];
const playersPicInfo = [];

const getUserDataFromToken = (token) => { // had lfunction kayreturni id&name&img of user from the token
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    console.log("*  succesfully got the pic", decoded.profileImage, " and data");
    console.log("JWT payload:", decoded);

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

function broadcastQueueState(io, waitingQueue) {
  const avatars = waitingQueue.map(s => s.data.user.avatar);

  waitingQueue.forEach((s) => {
    s.emit("update_avatars", {
      number: waitingQueue.length,
      avatars: avatars
    });
  });
}

function broadcastExitNotif(io, waitingQueue) {
  waitingQueue.forEach((s) => {
    s.emit("host_exit");
  });
}

export const StartTournament = (server) => {

    const io = new Server(server, { cors: { origin: "*" }, methods: ["GET", "POST"] });
    
    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token;
        if (!token) { // check tocken (JWT)
            // console.log('❌ Connection rejected: No token provided.');
            socket.disconnect();
            return;
        }
        const userData = getUserDataFromToken(token);
        if (!userData) {
            socket.disconnect();
            return;
        }
        socket.data.user = userData; 
        socket.data.userId = userData.id;

        console.log(`🔌 User ${userData.name} connected!`);
        console.log(`----------------- pic is: ${userData.avatar}`);

        // socket.on("leave_queue", () => {
        //     console.log("entered the leave queue socket event handler")
        //     const index = waitingQueue.findIndex(
        //         s => s.data.userId === socket.data.userId
        //     );
        //     if (index !== -1 && index !== 0) {
        //         waitingQueue.splice(index, 1);
        //         playersPicInfo.splice(index, 1);
        //         console.log(`${socket.data.userId} removed from queue (leave_queue)`);
        //         broadcastQueueState(io, waitingQueue);
        //     }
        // });
        socket.on("disconnect", (reason) => {
            console.log("entered the leave queue socket event handler")
            const index = waitingQueue.findIndex(
                s => s.data.userId === socket.data.userId
            );
            if (index !== -1 && index !== 0) {
                waitingQueue.splice(index, 1);
                playersPicInfo.splice(index, 1);
                console.log(`${socket.data.userId} removed from queue (leave_queue)`);
                broadcastQueueState(io, waitingQueue);
            }
            else if (index === 0) {
                broadcastExitNotif(io, waitingQueue);
            }
        });

        socket.on("join_queue", () => {
            const userId = socket.data.userId;
            const userData = socket.data.user;

            const alreadyQueued = waitingQueue.some(
                s => s.data.userId === userId
            );
    
            if (alreadyQueued) {
                console.log(`${userId} already in queue, successfuly ignored`);
                return;
            }
    
            waitingQueue.push(socket);
            playersPicInfo.push(userData.avatar);/// this is wronggggg
            console.log(`Queue size: ${waitingQueue.length}`);
            broadcastQueueState(io, waitingQueue);
            socket.emit("player_connected", {pic: userData.avatar, name: userData.name, number: waitingQueue.length, avatars: playersPicInfo})
            if (waitingQueue.length > 1) {
                console.log(`hello waitingQueue.lenth is: ${waitingQueue.length}`)
                io.emit('update_avatars', {number: waitingQueue.length})
            }

            if (waitingQueue.length >= 4) {
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
    
                // player1.emit("match_found", matchInfo);
                // player2.emit("match_found", matchInfo);
    
                // const game = new GameRoom(io, matchId, player1, player2);
                // game.start();
            } else {
                socket.emit("waiting_for_match", {
                message: "Waiting for players..."
                });
            }
        });
    });
}
