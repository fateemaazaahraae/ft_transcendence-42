// backend/game-service/GameRoom.js

class GameRoom {
  constructor(io, roomId, player1Socket, player2Socket) {
    this.io = io;
    this.roomId = roomId;
    this.player1 = player1Socket;
    this.player2 = player2Socket;

    // 1. Define the Game State
    // (We assume a standard canvas size, e.g., 800x600. Adjust to match your frontend)
    this.gameState = {
      ball: { x: 672, y: 290, dx: 5, dy: 5 },
      paddle1: { y: 250 },
      paddle2: { y: 250 },
      score: { p1: 0, p2: 0 }
    };

    // group the two players so we can send messages just to them.
    this.player1.join(roomId);
    this.player2.join(roomId);
  }

  start() {
    console.log(`🎮 Game Room ${this.roomId} started!`);

    // update with new position 30 times each 1 second (u may think it's a lot but it is good)
    this.interval = setInterval(() => {
      this.update();     // move the object
      this.broadcast();  // and send new positions
    }, 1000 / 30);
  }

  update() {
    const SPEED = 10;
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const CANVAS_HEIGHT = 580;
    const CANVAS_WIDTH = 1344;
    const BALL_SIZE = 10; // radius
    this.gameState.ball.x += this.gameState.ball.dx;
    this.gameState.ball.y += this.gameState.ball.dy;

    if (this.gameState.ball.y <= 0 || this.gameState.ball.y >= 580) {
      this.gameState.ball.dy *= -1;
    }
    if (this.gameState.ball.y - BALL_SIZE <= 0 || this.gameState.ball.y + BALL_SIZE >= CANVAS_HEIGHT) {
      this.gameState.ball.dy *= -1;
    }

    if (this.gameState.ball.x - BALL_SIZE <= 0 || this.gameState.ball.x + BALL_SIZE >= CANVAS_WIDTH ) {
      this.gameState.ball.dx *= -1;
    }
  }

  broadcast() {
    // Send the entire state to everyone in this specific room // using server instance socket.io and the room id so we know to which room we're talking yah ofc
    this.io.to(this.roomId).emit('game_update', this.gameState);
    // this.io.to(this.roomId).emit('game_over');
  }

  stop() {
    clearInterval(this.interval);
    // Clean up rooms
    this.player1.leave(this.roomId);
    this.player2.leave(this.roomId);
  }
}

module.exports = GameRoom;
