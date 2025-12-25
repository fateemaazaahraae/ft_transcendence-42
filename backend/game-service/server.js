const fastify = require('fastify')({ logger: true });
const { Server } = require('socket.io');
const GameRoom = require('./GameRoom'); // I will do it later just to have an idea
const { getDb } = require('./db');

const waitingQueue = []; // array to store my players until I have a size of 2

fastify.get('/test', async (request, reply) => {
  return { message: 'Game service is working!' };
});
await fastify.register(fastifyCors, {
  origin: '*',
  credentials: true,
  methods: ['GET','PUT','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

const getUserDataFromToken = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson);
    
    return {
        id: decoded.id,
        name: decoded.userName,       // Make sure these match your JWT fields
        avatar: decoded.profileImage || "/public/default-avatar.svg" // Fallback
    };
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return null;
  }
};

const getUserIdFromToken = (token) => {
  try {
    // JWT structure is: header.payload.signature
    // We want the payload (the 2nd part)
    const payloadBase64 = token.split('.')[1];
    // Decode Base64 to String
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    // Parse JSON
    const decoded = JSON.parse(decodedJson);
    return decoded.id;
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

      const userId = getUserIdFromToken(token);
      
      // socket.data.userId = token.slice(40, 50) + '...'; // slice my token to make printing it easy
      // const usser = token.slice(0, 50) + '...'; // slice my token to make printing it easy
      if (!userId) {
         console.log('❌ Connection rejected: Invalid Token format.');
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

      // 3. Store the clean UUID
      // socket.data.userId = userId;
      // console.log(`User connected! Socket ID: ${socket.id} | User ID: ${socket.data.userId}`);

      socket.on('join_queue', () => {
        if (waitingQueue.find(s => s.id === socket.id)) { // if the tocken already in my array return 
          return;
        }
        // if not push it
        waitingQueue.push(socket);
        console.log(`${socket.data.userId} joined the queue. queue size===:${waitingQueue.length}===`);

        if (waitingQueue.length >= 2) {
            const player1 = waitingQueue.shift();
            const player2 = waitingQueue.shift();

            const matchId = `match_${Date.now()}`; 

            // Prepare the Match Data
            const matchInfo = {
                matchId: matchId,
                player1: player1.data.user, // Contains {id, name, avatar}
                player2: player2.data.user
            };

            console.log(`🚀 Match: ${matchInfo.player1.name} vs ${matchInfo.player2.name}`);

            // Notify players with FULL info
            player1.emit('match_found', matchInfo);
            player2.emit('match_found', matchInfo);

            const game = new GameRoom(io, matchId, player1, player2);
            game.start();
        }
        else {// case mazal mawslna l joj dial players
          socket.emit('waiting_for_match', { message: `Waiting for opponent... Current queue: ${waitingQueue.length}` });
        }
      });

      socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.data.userId}`);
        // socket.emit('game_over');


        const index = waitingQueue.findIndex(s => s.id === socket.id);
        if (index !== -1) {
          waitingQueue.splice(index, 1);// splice (index) from where start removing and (1) how many to remove
          console.log(`${socket.data.userId} removed from queue.bslama`);
        }
      });
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();