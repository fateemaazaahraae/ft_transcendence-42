const fastify = require('fastify')({ logger: true });
const { Server } = require('socket.io');
const GameRoom = require('./GameRoom'); // I will do it later just to have an idea

const waitingQueue = [];

fastify.get('/test', async (request, reply) => {
  return { message: 'Game service is working!' };
});

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

      // socket.data.userId = token.slice(0, 10) + '...';
      // console.log(`🔌 User connected! Socket ID: ${socket.id} | User ID: ${socket.data.userId}`);
      
      // 3. Handle 'join_queue'
      socket.on('join_queue', () => {
          if (waitingQueue.find(s => s.id === socket.id)) { // if the tocken already in my array return 
              return;
          }
          // if not push it
          waitingQueue.push(socket);

          if (waitingQueue.length >= 2) {
              const player1 = waitingQueue.shift();
              const player2 = waitingQueue.shift();

              const matchId = `match_${Date.now()}`; 

              player1.emit('match_found', { matchId: matchId, opponentId: player2.data.userId }); // sending match_found to notify that match is ready to start
              player2.emit('match_found', { matchId: matchId, opponentId: player1.data.userId });

              const game = new GameRoom(io, matchId, player1, player2);// call our class with the parameters needed
              game.start(); //  a function I will create in the class to start the game !!
          } else {
              socket.emit('waiting_for_match', { message: `Waiting for opponent... Current queue: ${waitingQueue.length}` });
          }
      });

      // if client disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.userId}`);
        
        const index = waitingQueue.findIndex(s => s.id === socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
        }
      });
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();