import { Server } from "socket.io";
import GameRoom from "./TournamentRoom.js";
import { openDb } from "./db.js";

const tournaments = {}; 

const getUserDataFromToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    console.log("*  succesfully got the pic", decoded.profileImage, " and data");
    console.log("JWT payload:", decoded);

    return {
        id: decoded.id,
        name: decoded.userName,       // Make sure these match JWT fields
        avatar: decoded.profileImage || "/public/default.png" // Fallback
    };
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return null;
  }
};

function broadcastQueueState(io, tournamentId) {
  const QueueState = tournaments[tournamentId];
  if (!QueueState) return;
  const avatars = getAvatars(QueueState.waiting);

  // console.log(`the avatar is : ${avatars}`);
  QueueState.waiting.forEach((s) => {
    s.emit("update_avatars", {
      number: QueueState.waiting.length,
      avatars: avatars
    });
  });
}

function getAvatars(queue) {
  const avatars = queue.map(s => s.data.user.avatar);
  return avatars;
}

export const StartTournament =(server) => {

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
        socket.data.userId = userData.id;

        console.log(`🔌 User ${userData.name} connected!`);

        const handleLeave = async (tournamentId) => {
          if (!tournamentId || !tournaments[tournamentId]) return;
          
          const QueueState = tournaments[tournamentId];
          const index = QueueState.waiting.findIndex(
            s => s.data.userId === socket.data.userId
          );
          if (index !== -1) {
            QueueState.waiting.splice(index, 1);
            QueueState.save.splice(index, 1);
            try {
              const db = await openDb();

              await db.run(
              `UPDATE tournaments
              SET players = ?
              WHERE id = ?`,
              [QueueState.waiting.length, tournamentId]
              );
              console.log("✅ Tr Match is saved to SQLite database!" + QueueState.waiting.length);
            } catch (error) {
              console.error("❌ Failed to save Tr match:", error);
            }
            broadcastQueueState(io, tournamentId);
          }
        }

        socket.on('GoToFinal', () => {
          console.log(`\n\n🔥Let'sss go to the final yalaaah🔥\n\n`);
          let WinnerSide = 1;
          const tId = socket.data.tournamentId;
          if (!tId || !tournaments[tId]) return;

          const QueueState = tournaments[tId];
          if (QueueState.save.length >= 2 && (socket === QueueState.save[0] || socket === QueueState.save[1])) {
            console.log(`\n\nUr player with the pic: ${socket.data.user.avatar} is in the ---first--- half of the game tournament \n\n`);
            WinnerSide = 1;
          } else {
            console.log(`\n\nUr player with the pic: ${socket.data.user.avatar} is in the ---second--- half of the game tournament \n\n`);
            WinnerSide = 2;
          }

          if (!QueueState.finalists) QueueState.finalists = [];
          QueueState.finalists.push(socket);///////

          let playersPicInfo = getAvatars(QueueState.finalists);

          io.to(tId).emit("startWaitFinal", {avatars: playersPicInfo, WinnerSide: WinnerSide});
          if (QueueState.finalists.length === 2) {
            const player1 = QueueState.finalists[0];
            const player2 = QueueState.finalists[1];
            const matchId = `match_${Date.now()}`;
            const matchInfo = {
              matchId,
              player1: player1.data.user,
              player2: player2.data.user
            };
            io.to(tId).emit("start_final_game", matchInfo);
            console.log("match final en cours");
            const gameFinal = new GameRoom(io, matchId, player1, player2);
            gameFinal.start();
            delete tournaments[tId]; 
          }
        });

        socket.on("join_queue", async (data) => {
          const tournamentId = data.tournamentId;

            if(!tournaments[tournamentId]) {
              tournaments[tournamentId] = {
                waiting: [],
                save: [],
                finalists: [],
                Nicknames: []
              };
            }
            const QueueState = tournaments[tournamentId];

            const alreadyQueued = QueueState.waiting.some(
                s => s.data.userId === socket.data.userId
            );
            if (alreadyQueued) {
                console.log(`${socket.data.userId} already in queue, successfuly ignored`);
                return;
            }
    
            QueueState.waiting.push(socket);
            QueueState.save.push(socket);
            QueueState.Nicknames.push(data.nick)

            socket.join(tournamentId);
            socket.data.tournamentId = tournamentId;
            console.log(`Queue size: ${QueueState.waiting.length}`);
            try {
                  const db = await openDb();

                  await db.run(
                  `UPDATE tournaments
                  SET players = ?
                  WHERE id = ?`,
                  [QueueState.waiting.length, tournamentId]
                  );
                  
                  console.log("✅ Tr Match is saved to SQLite database!");
              } catch (error) {
                  console.error("❌ Failed to save Tr match:", error);
              }
            socket.emit("player_connected", {
              pic: userData.avatar,
              name: userData.name,
              number: QueueState.waiting.length,
              avatars: getAvatars(QueueState.waiting),
              tournamentId: tournamentId
            });
            broadcastQueueState(io, tournamentId);
            // if (waitingQueue.length > 1) {
            //     console.log(`hello waitingQueue.lenth is: ${waitingQueue.length}`)
            //     io.emit('update_avatars', {number: waitingQueue.length})
            // }

            if (QueueState.waiting.length >= 4) {
                const player1 = QueueState.waiting.shift();
                const player2 = QueueState.waiting.shift();
                const player3 = QueueState.waiting.shift();
                const player4 = QueueState.waiting.shift();
                // const nick1 = QueueState.Nick.shift();
                // const nick2 = QueueState.Nick.shift();
                // const nick3 = QueueState.Nick.shift();
                // const nick4 = QueueState.Nick.shift();
                

                console.log(`the size of ----SaveQueue----- become: ${QueueState.save.length} `)
    
                if ((player1.data.userId === player2.data.userId) || (player3.data.userId === player4.data.userId)) return;
    
                const match1Id = `match_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                const match2Id = `match_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
                const match1Info = {
                  match1Id,
                  player1: player1.data.user,
                  player2: player2.data.user,
                  Nickname1: QueueState.Nicknames.shift(),
                  Nickname2: QueueState.Nicknames.shift()
                };
                const match2Info = {
                  match2Id,
                  player3: player3.data.user,
                  player4: player4.data.user,
                  Nickname3: QueueState.Nicknames.shift(),
                  Nickname4: QueueState.Nicknames.shift()
                };
                
                player1.emit("match_found1", match1Info);
                player2.emit("match_found1", match1Info);
                player3.emit("match_found2", match2Info);
                player4.emit("match_found2", match2Info);
                
                console.log(`🚀 Match: ${match1Info.player1.avatar} vs ${match1Info.player2.avatar}`);
                console.log(`🚀 Match: ${match2Info.player3.avatar} vs ${match2Info.player4.avatar}`);
                
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
        socket.on("leave_queue", (data) => {
          handleLeave(data.tournamentId);
          // const index = waitingQueue.findIndex(
          //   s => s.data.userId === socket.data.userId
          // );
          // if (index !== -1) {
          //   waitingQueue.splice(index, 1);
          //   SaveQueue.splice(index, 1);
          //   try {
          //     const db = await openDb();

          //     await db.run(
          //     `UPDATE tournaments
          //     SET players = ?
          //     WHERE id = ?`,
          //     [waitingQueue.length, data.tournamentId]
          //     );
              
          //     console.log("✅ Tr Match is saved to SQLite database!" + waitingQueue.length);
          //   } catch (error) {
          //     console.error("❌ Failed to save Tr match:", error);
          //   }
          //   broadcastQueueState(io, waitingQueue);
          // }
        });
        socket.on("disconnect", (data) => {
          handleLeave(socket.data.tournamentId);
        });
    });
}
