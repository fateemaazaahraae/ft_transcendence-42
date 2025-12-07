const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/cors'), {
  origin: '*', // Allow ALL origins (for testing)
  methods: ['GET', 'POST'] // Allow these HTTP methods
});

// Keep the test route
fastify.get('/test', async (request, reply) => {
  return { message: 'Game service is working!' };
});

// 🎮 NEW: A REAL game route
fastify.post('/create-game', async (request, reply) => {
  // Get data from request
  const { playerName, gameType } = request.body;
  
  // Create a simple game object (we'll use database later)
  const gameId = Date.now(); // Simple ID for now
  const game = {
    id: gameId,
    player1: playerName,
    player2: null, // Waiting for opponent
    score: { player1: 0, player2: 0 },
    status: 'waiting',
    createdAt: new Date().toISOString()
  };
  
  console.log(`🎮 Game created: ${playerName} wants to play ${gameType}`);
  
  return { 
    success: true, 
    message: 'Game created!',
    gameId: gameId,
    joinUrl: `http://localhost:3003/join-game/${gameId}`
  };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: 3003,
      host: '0.0.0.0'
    });
    console.log('✅ Server running at http://localhost:3003');
    console.log('📝 Available routes:');
    console.log('   GET  /test');
    console.log('   POST /create-game');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

start();