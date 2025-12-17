const fastify = require('fastify')({ logger: true });
const { Server } = require('socket.io');
const GameRoom = require('./GameRoom'); // I will do it later just to have an idea

const waitingQueue = []; // array to store my players until I have a size of 2

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

      socket.data.userId = token.slice(40, 50) + '...'; // slice my token to make printing it easy
      console.log(`User connected! Socket ID: ${socket.id} | User ID: ${socket.data.userId}`);

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
          console.log(`Match found! ${player1.data.userId} vs ${player2.data.userId}`);

          // this is what is make screen switch to Game Screen yaaaay
          player1.emit('match_found', { matchId: matchId, opponentId: player2.data.userId });
          player2.emit('match_found', { matchId: matchId, opponentId: player1.data.userId });

          // GAME IS ONNN //the para. we're sedingAre: io the room the game if I send something using io I send to every player in the same match
                          //                           matchId (Unique identifier for this game) 
                          //                           and for player1&&player2 they are sockets for user1 and user2 that has the data with which I can send things
          const game = new GameRoom(io, matchId, player1, player2); // we're calling the constructor for the GameRomm class
          game.start(); // calling GameRoom::start() ft
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