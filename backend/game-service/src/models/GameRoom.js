import { getDb } from "./db.js";

export default class GameRoom {
  constructor(io, roomId, player1Socket, player2Socket) {
    this.io = io;
    this.roomId = roomId;
    this.player1 = player1Socket;
    this.player2 = player2Socket;

    // my canvas size, 1344x580//(x, y)
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
    this.isGameOver = false;
    }

    async handlePlayerDisconnect(disconnectedSocket) {
      // console.log(this.player1.id, "<--- id1 id2--->", this.player2.id)
      if (this.isGameOver) return;

      this.isGameOver = true;

      let winnerSocket = null;

      if (disconnectedSocket.id === this.player1.id) {
        winnerSocket = this.player2;
      } else if (disconnectedSocket.id === this.player2.id) {
        winnerSocket = this.player1;
      }

      if (winnerSocket && winnerSocket.connected) {
        this.io.to(winnerSocket.id).emit('game_over', {
          winner: winnerSocket.data.userId,
          reason: 'opponent_disconnected',
          score: this.gameState.score
        });
      }
      const winnerId = winnerSocket.data.userId;
      const loserId =
      winnerId === this.player1.data.userId
        ? this.player2.data.userId
        : this.player1.data.userId;

      try {
        const db = await getDb();
        const matchId = this.roomId;
        const timestamp = Date.now();
        const winner = winnerSocket.data.userId;

        await db.run(
          `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
          [winnerId]
        );
        await db.run(
          `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
          [loserId]
        );

        await db.run(
          `UPDATE wlxp
          SET Wins = Wins + 1,
              XPoints = XPoints + 50
          WHERE id = ?`,
          [winnerId]
        );
        console.log("***********updating the win/lose data***********");


        await db.run(
          `UPDATE wlxp
          SET Losses = Losses + 1
          WHERE id = ?`,
          [loserId]
        );

        await db.run(
            `INSERT INTO matches (id, player1Id, player2Id, score1, score2, winnerId, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                matchId,
                this.player1.data.userId,
                this.player2.data.userId,
                this.gameState.score.p1,
                this.gameState.score.p2,
                winner,
                timestamp
            ]
        );
        
      console.log(this.player1.id, "<--- id1 id2--->", this.player2.id);
        console.log("✅ Match saved to SQLite database!");

    } catch (error) {
        console.error("❌ Failed to save match:", error);
    }

  this.stop();
}

    _setupListeners(socket) {
      socket.on('input_update', (data) => {
        if (this.input[socket.id]) {
          if (data.input === 'UP') this.input[socket.id].up = data.isPressed;
          if (data.input === 'DOWN') this.input[socket.id].down = data.isPressed;
        }
      });

      socket.on('leave_game', () => {
        console.log(`Player ${socket.data.userId} left the game`);
        this.handlePlayerDisconnect(socket);
      });

      socket.on('disconnect', () => {
          console.log(`Player ${socket.data.userId} disconnected during or after match!`);
          
          // this.handlePlayerDisconnect(socket);
      });
    }

  start() {
    console.log(`🎮 Game Room ${this.roomId} started!`);

    // update with new position 30 times each 1 second (u may think it's a lot but it is good)
    // let last = performance.now();
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
    const WIN_SCORE = 3;
    this.gameState.ball.x += this.gameState.ball.dx;
    this.gameState.ball.y += this.gameState.ball.dy;

    // const dt = Math.min((now - last) / 1000, 0.04);
    // last = now;

    // const PrevX = ball.x;
    // const PrevY = ball.y;
    // const NewX = ball.x + ball.vx * dt;// following the rule : position' = position + velocity * dt; (to calculate value in px)
    // const NewY = ball.y + ball.vy * dt;


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

    // Later we will check for paddle collisions here
    // if (this.gameState.ball.x - BALL_SIZE <= 0 || this.gameState.ball.x + BALL_SIZE >= CANVAS_WIDTH) {
    //   this.gameState.ball.dx *= -1;
    // }
    if (
      this.gameState.ball.dx < 0 && // Only check if moving left
      this.gameState.ball.x - BALL_SIZE <= PADDLE_WIDTH + 8 && // Ball hit the paddle's right edge
      this.gameState.ball.x + BALL_SIZE >= PADDLE_WIDTH && // Ball isn't behind the paddle
      this.gameState.ball.y >= this.gameState.paddle1.y &&
      this.gameState.ball.y <= this.gameState.paddle1.y + PADDLE_HEIGHT
    ) {
      this.gameState.ball.dx *= -1;
      // Speed up slightly for fun
      this.gameState.ball.dx *= 1.5; 
      this.gameState.ball.dy *= 1.5;
    }

    if (
      this.gameState.ball.dx > 0 && // Only check if moving right
      this.gameState.ball.x + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 8 && // Ball hit the paddle's left edge
      this.gameState.ball.x - BALL_SIZE <= CANVAS_WIDTH - PADDLE_WIDTH && // Ball isn't behind
      this.gameState.ball.y >= this.gameState.paddle2.y &&
      this.gameState.ball.y <= this.gameState.paddle2.y + PADDLE_HEIGHT
    ) {
      this.gameState.ball.dx *= -1;
      this.gameState.ball.dx *= 1.5; 
      this.gameState.ball.dy *= 1.5;
    }


    if (this.gameState.score.p1 >= WIN_SCORE) {
        this.endGame(this.player1.data.userId); // Player 1 Wins
    } 
    else if (this.gameState.score.p2 >= WIN_SCORE) {
        this.endGame(this.player2.data.userId); // Player 2 Wins
    }


    if (this.gameState.ball.x < 0) {
      this.gameState.score.p2 += 1;
      this.resetBall(false);
    }
    // Ball went off the Right side (Player 1 scores)
    else if (this.gameState.ball.x > CANVAS_WIDTH) {
      this.gameState.score.p1 += 1;
      this.resetBall(true);
    }
    
  }

  async endGame(winnerId) {
    console.log(`🏆 Game Over! Winner: ${winnerId}`);
    
    // Tell everyone who won
    this.io.to(this.roomId).emit('game_over', { 
      winner: winnerId,
      score: this.gameState.score 
    });

    const loserId =
    winnerId === this.player1.data.userId
      ? this.player2.data.userId
      : this.player1.data.userId;

    
    try {
        const db = await getDb();
        const matchId = this.roomId;
        const timestamp = Date.now();


        console.log("-------------winerid: ", winnerId, "----------------loserId: ", loserId);
        await db.run(
          `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
          [winnerId]
        );
        await db.run(
          `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
          [loserId]
        );

        await db.run(
          `UPDATE wlxp
          SET Wins = Wins + 1,
              XPoints = XPoints + 50
          WHERE id = ?`,
          [winnerId]
        );
        console.log("***********updating the win/lose data***********");

        await db.run(
          `UPDATE wlxp
          SET Losses = Losses + 1
          WHERE id = ?`,
          [loserId]
        );

        await db.run(
            `INSERT INTO matches (id, player1Id, player2Id, score1, score2, winnerId, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                matchId,
                this.player1.data.userId,
                this.player2.data.userId,
                this.gameState.score.p1,
                this.gameState.score.p2,
                winnerId,
                timestamp
            ]
        );
        
        console.log("✅ Match saved to SQLite database!");

    } catch (error) {
        console.error("❌ Failed to save match:", error);
    }

    // Stop the loop
    this.stop(); 
  }
  
  resetBall (moveTo = null) {
    this.gameState.ball = { x: 672, y: 290, dx: 5, dy: 5 };
    // Serve to the player who lost the point (or random)
    const dir = typeof MoveTo === 'boolean' ? (MoveTo ? 1 : -1) : (Math.random() < 0.5 ? 1 : -1); // if a boolean value is entred si nn randomly right or left
    this.gameState.ball.dx *= dir;
    this.gameState.ball.dy *= dir;
  }

  broadcast() {
    // Send the entire state to everyone in this specific room // using server instance socket.io and the room id so we know to which room we're talking yah ofc
    this.io.to(this.roomId).emit('game_update', this.gameState);
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

