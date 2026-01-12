import { Server } from "socket.io";
import GameRoom from "./TournamentRoom.js";
import { openDb } from "./db.js";

const waitingQueue = [];
const SaveQueue = [];

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
  // console.log("updating avatarsss!!");
  const avatars = waitingQueue.map(s => s.data.user.avatar);

  // console.log(`the avatar is : ${avatars}`);
  waitingQueue.forEach((s) => {
    s.emit("update_avatars", {
      number: waitingQueue.length,
      avatars: avatars
    });
  });
}

function getAvatars(waitingQueue) {
  const avatars = waitingQueue.map(s => s.data.user.avatar);
  return avatars;
}

// function broadcastExitNotif(io, waitingQueue) {
//   waitingQueue.forEach((s) => {
//     s.emit("host_exit");
//   });
// }

export const StartTournament =(server) => {

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
            const index = waitingQueue.findIndex(
                s => s.data.userId === socket.data.userId
            );
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                SaveQueue.splice(index, 1);
                console.log(`${socket.data.userId} removed from queue (leave_queue)`);
                broadcastQueueState(io, waitingQueue);
            }
        });

        socket.on('GoToFinal', () => {
          console.log(`\n\n🔥Let'sss go to the final yalaaah🔥\n\n`);
          let WinnerSide;
          console.log(`the pic in index 0 is: ${SaveQueue[0].data.user.avatar}`)
          console.log(`the pic in index 1 is: ${SaveQueue[1].data.user.avatar}`)
          console.log(`the pic in index 2 is: ${SaveQueue[2].data.user.avatar}`)
          console.log(`the pic in index 3 is: ${SaveQueue[3].data.user.avatar}`)
          if (socket == SaveQueue[0] || socket == SaveQueue[1]) {
            console.log(`\n\nUr player with the pic: ${socket.data.user.avatar} is in the ---first--- half of the game tournament \n\n`);
            WinnerSide = 1;
          } else {
            console.log(`\n\nUr player with the pic: ${socket.data.user.avatar} is in the ---second--- half of the game tournament \n\n`);
            WinnerSide = 2;
          }
          SaveQueue.push(socket);
          let playersPicInfo = [];
          playersPicInfo = getAvatars(SaveQueue);
          socket.emit("startWaitFinal", {avatars: playersPicInfo, WinnerSide: WinnerSide});
          if (SaveQueue.length === 6) {
            const player1 = SaveQueue[4];
            const player2 = SaveQueue[5];
            const matchId = `match_${Date.now()}`;
            const matchInfo = {
              matchId,
              player1: player1.data.user,
              player2: player2.data.user
            };
            player1.emit("start_final_game", matchInfo);
            player2.emit("start_final_game", matchInfo);
            console.log("match final en cours");
            const gameFinal = new GameRoom(io, matchId, player1, player2);
            gameFinal.start();
            SaveQueue.length = 0;
          }
        });

        socket.on("join_queue", async (data) => {
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
            SaveQueue.push(socket);
            let playersPicInfo = [];
            playersPicInfo = getAvatars(waitingQueue);
            console.log(`Queue size: ${waitingQueue.length}`);
            try {
                  const db = await openDb();

                  await db.run(
                  `UPDATE players
                  SET players = ?
                  WHERE id = ?`,
                  [waitingQueue.length, data.tournamentId]
                  );
                  
                  console.log("✅ Match vs Ai is saved to SQLite database!");
              } catch (error) {
                  console.error("❌ Failed to save Ai match:", error);
              }
            broadcastQueueState(io, waitingQueue);
            socket.emit("player_connected", {pic: userData.avatar, name: userData.name, number: waitingQueue.length, avatars: playersPicInfo})
            if (waitingQueue.length > 1) {
                console.log(`hello waitingQueue.lenth is: ${waitingQueue.length}`)
                io.emit('update_avatars', {number: waitingQueue.length})
            }

            if (waitingQueue.length >= 4) {
                const player1 = waitingQueue.shift();
                const player2 = waitingQueue.shift();
                const player3 = waitingQueue.shift();
                const player4 = waitingQueue.shift();

                console.log(`the size of ----SaveQueue----- become: ${SaveQueue.length} `)
    
                if (player1.data.userId === player2.data.userId) {
                  return;
                }
                if (player3.data.userId === player4.data.userId) {
                  return;
                }
    
                const match1Id = `match_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                const match2Id = `match_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
                // console.log(`match111Id is: ${match1Id}`);
                // console.log(`match222Id is: ${match2Id}`);
                const match1Info = {
                  match1Id,
                  player1: player1.data.user,
                  player2: player2.data.user
                };
                const match2Info = {
                  match2Id,
                  player3: player3.data.user,
                  player4: player4.data.user
                };
    
                console.log(`🚀 Match: ${match1Info.player1.avatar} vs ${match1Info.player2.avatar}`);
                console.log(`🚀 Match: ${match2Info.player3.avatar} vs ${match2Info.player4.avatar}`);
    
                player1.emit("match_found1", match1Info);
                player2.emit("match_found1", match1Info);

                player3.emit("match_found2", match2Info);
                player4.emit("match_found2", match2Info);
    
                console.log("match 1 is en cours");
                const game1 = new GameRoom(io, match1Id, player1, player2);
                game1.start();
                console.log("match 2 is en cours");
                const game2 = new GameRoom(io, match2Id, player3, player4);
                game2.start();
            } else {
                console.log("Waiting for players...");
            }
        });
    });
}
