// backend/game-service/GameRoom.js

class GameRoom {
  constructor(io, roomId, player1Socket, player2Socket) {
    this.io = io;
    this.roomId = roomId;
    this.player1 = player1Socket;
    this.player2 = player2Socket;

    // my canvas size, 1430x850
    this.gameState = {// contain the new positions for ball and paddles
      ball: { x: 672, y: 290, dx: 5, dy: 5 },
      paddle1: { y: 250 },
      paddle2: { y: 250 },
      score: { p1: 0, p2: 0 }
    };

    this.input = {
      [this.player1.id]: { up: false, down: false },
      [this.player2.id]: { up: false, down: false }
    };

    this.player1.join(roomId);
    this.player2.join(roomId);
    
    this._setupListeners(this.player1);
    this._setupListeners(this.player2);
    }

    _setupListeners(socket) {
      socket.on('input_update', (data) => {
        if (this.input[socket.id]) {
          if (data.input === 'UP') this.input[socket.id].up = data.isPressed;
          if (data.input === 'DOWN') this.input[socket.id].down = data.isPressed;
        }
      });
    }

  start() {
    console.log(`🎮 Game Room ${this.roomId} started!`);

    // update with new position 30 times each 1 second (u may think it's a lot but it is good)
    let last = performance.now();
    this.interval = setInterval(() => {
      this.update();     // move the object
      this.broadcast();  // and send new positions
    }, 1000 / 30);
  }

  update() {
    const SPEED = 10;
    const PADDLE_HEIGHT = 115;
    const PADDLE_WIDTH = 10;
    const CANVAS_HEIGHT = 580;
    const CANVAS_WIDTH = 1344;
    const BALL_SIZE = 10; // radius
    this.gameState.ball.x += this.gameState.ball.dx;
    this.gameState.ball.y += this.gameState.ball.dy;

      if (this.input[this.player1.id].up) {
          this.gameState.paddle1.y = Math.max(0, this.gameState.paddle1.y - SPEED);
      }
      if (this.input[this.player1.id].down) {
          this.gameState.paddle1.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, this.gameState.paddle1.y + SPEED);
      }

      if (this.input[this.player2.id].up) {
          this.gameState.paddle2.y = Math.max(0, this.gameState.paddle2.y - SPEED);
      }
      if (this.input[this.player2.id].down) {
          this.gameState.paddle2.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, this.gameState.paddle2.y + SPEED);
      }

      this.gameState.ball.x += this.gameState.ball.dx;
      this.gameState.ball.y += this.gameState.ball.dy;
  
      if (this.gameState.ball.y - BALL_SIZE <= 0 || this.gameState.ball.y + BALL_SIZE >= CANVAS_HEIGHT) {
        this.gameState.ball.dy *= -1;
      }
      
      // Simple Bounce (Left/Right) - JUST FOR TESTING
      // Later we will check for paddle collisions here
      if (this.gameState.ball.x - BALL_SIZE <= 0 || this.gameState.ball.x + BALL_SIZE >= CANVAS_WIDTH) {
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
    // Clean up listeners to avoid memory leaks
    this.player1.removeAllListeners('input_update');
    this.player2.removeAllListeners('input_update');
    // Clean up rooms
    this.player1.leave(this.roomId);
    this.player2.leave(this.roomId);
  }
}

module.exports = GameRoom;
