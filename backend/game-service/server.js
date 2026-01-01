const fastify = require('fastify')({ logger: true });
const { Server } = require('socket.io');
const GameRoom = require('./GameRoom'); // I will do it later just to have an idea
const { getDb } = require('./db');

const waitingQueue = []; // array to store my players until I have a size of 2

fastify.get('/test', async (request, reply) => {
  return { message: 'Game service is working!' };
});

fastify.get('/matches/user/:userId', async (request, reply) => {
    const userId = request.params.userId;
    try {
        const db = await getDb();
        
        const matches = await db.all(
          `SELECT * FROM matches 
          WHERE player1Id = ? OR player2Id = ? 
          ORDER BY timestamp DESC`,
          [userId, userId]
        );
        
        return matches;
    } catch (err) {
        console.error(err);
        return reply.code(500).send({ error: 'Database error' });
    }
});

const getUserDataFromToken = (token) => { // had lfunction kayreturni id&name&img of user from the token
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
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

const start = async () => {
  try {
    await fastify.listen({ port: 3003, host: '0.0.0.0' });
    console.log('✅ HTTP Server running at http://localhost:3003');

    const io = new Server(fastify.server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });

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
          console.log(`${userId} already in queue, successfuly ignored`);
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

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();