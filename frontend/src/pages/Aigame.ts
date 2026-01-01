import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function AiGame() {
  if (!requiredAuth())
    return "";
  
  const game = {
    match: [{
      player1: {
        avatar: "/public/pink-girl.svg",
        name: "Salma",
        score: 0,
      }, 
      player2: {
        avatar: "/public/Aipic.png", //"/public/Aiplayresize.png"
        name: "Ai",
        score: 0, 
      },
    }],
  }; 
  
  return `
  <div id="container" class="relative w-full h-screen">

    <!-- Player Info & Score -->
    <div class="absolute left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-4 lg:gap-60 top-[25%] md:top-[23%] xl:top-[18%]">
      <div class="flex items-center justify-end w-[260px]">
        <img src="${game.match[0].player1.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-1 md:gap-3">
          <h1 class="font-glitch text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player1.name} </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">0</span>
        </div>
      </div>
      <div class="flex items-center justify-start w-[260px]">
        <div class="flex flex-col items-center gap-1 md:gap-3">
          <h1 class="font-glitch text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">0</span>
        </div>
        <img src="${game.match[0].player2.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-secondary object-cover border-[2px]"/>
      </div>
    </div>


    <!-- PAUSE BUTTON -->
    <div class="absolute top-[15%] lg:top-[10%] left-1/2 transform -translate-x-1/2 z-10">
      <button id="pause-btn" class="px-6 py-3 bg-black text-white border-secondary/40 overflow-hidden drop-shadow-pink rounded-lg font-roboto transition-all duration-300 flex items-center gap-2">
        <i class="fa-solid fa-pause"></i>
        Pause
      </button>
    </div>

    <!-- PAUSE OVERLAY (Hidden by default) -->
    <div id="pause-overlay" class="absolute inset-0 bg-black/50 z-[100] hidden flex-col items-center justify-center">
      <div class="bg-black p-8 rounded-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
        <h2 class="text-3xl font-glitch text-primary mb-2">Game Paused</h2>
        <p class="font-roboto text-gray-300 mb-10">Take a break, adjust settings, or resume</p>
        
        <div class="space-y-4">
          <button id="resume-btn" class="w-[200px] py-3 bg-primary/80 hover:bg-primary text-white rounded-lg font-roboto transition-all duration-300">
            <i class="fa-solid fa-play mr-2"></i>
            Resume Game
          </button>
          
          <button id="restart-btn" class="w-[200px] py-3 bg-secondary/80 hover:bg-secondary text-white rounded-lg font-roboto transition-all duration-300">
            <i class="fa-solid fa-rotate-right mr-2"></i>
            Restart Game
          </button>
          
          <button id="quit-btn" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all duration-300">
            <i class="fa-solid fa-sign-out mr-2"></i>
            Quit to Menu
          </button>
        </div>
      </div>
    </div>

    <!-- GAME CANVAS AREA -->
    <div class="absolute left-1/2 transform -translate-x-1/2 rotate-90 lg:rotate-0 top-[43%] lg:top-[37%] xl:top-[32%] md:top-[38%] h-[38%] md:h-[55%] w-full md:w-[80%] lg:w-[70%] lg:h-[50%] xl:h-[60%] border-[#35C6DD]/40 rounded-3xl overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
      <!-- This is where the game will be drawn -->
      <canvas 
        id="pongCanvas"
        class="w-full h-full bg-black"
      ></canvas>
    </div>
  </div>
  `;
}

export function AiGameEventListener() {
  setTimeout(() => {
    // Back button
    // const backBtn = document.getElementById('back-btn');
    // if (backBtn) {
    //   backBtn.addEventListener('click', () => {
    //     // navigate('/LocalgameStyle');
    //   });
    // }
    
    let gameRunning = true;
    let animationId: number | null = null;
    let player1Score = 0;
    let player2Score = 0;
    const WINNING_SCORE = 2; // Check which player WINS the match score 5

    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
    const pauseOverlay = document.getElementById('pause-overlay') as HTMLDivElement;
    const resumeBtn = document.getElementById('resume-btn') as HTMLButtonElement;
    const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
    const quitBtn = document.getElementById('quit-btn') as HTMLButtonElement;
    const player1ScoreDisplay = document.getElementById('player1-score-display') as HTMLSpanElement;
    const player2ScoreDisplay = document.getElementById('player2-score-display') as HTMLSpanElement;

    function updateScoreDisplay() {
      if (player1ScoreDisplay) player1ScoreDisplay.textContent = player1Score.toString();
      if (player2ScoreDisplay) player2ScoreDisplay.textContent = player2Score.toString();
    }


    const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement | null;
    if (canvas)
    {
      console.log("Canvas found! Ready to start game.");
      
      // The canvas size l(height and width)
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      console.log(canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const c = ctx;
      const width = canvas.width;
      const height = canvas.height;
      console.log('widthhh is: ', width);
      // widthhh is:  1344

      const paddleWidth = 10;
      const paddleHeight = 115;
      const paddleLeftX = 8;
      const paddleRightX = width - paddleWidth - 8;

      let paddleRightY = (height - paddleHeight) / 2;// to give the paddles a centered position
      let paddleLeftY = (height - paddleHeight) / 3;

      // ball properties x, y, r, velocity/movingSpeed
      const ball = {
        x: width / 2,
        y: height / 2,
        r: 10,
        vx: (Math.random() < 0.5 ? 1 : -1) * 300,
        vy: (Math.random() < 0.5 ? 1 : -1) * 200,
      };

      const PaddleSpeed = 400; //// Pixels per second
      const SpeedIncreasing = 1.08; // Increase ball speed
      const maxBounceAngle = (75 * Math.PI) / 180; // we're just taking ±75° as the maximum angle the ball can bounce to.(we'll multiply it later by our degree or curve we want based on we're in the paddle the ball hit) and it will become smaller or not depending where the ball hit

      const keys: Record<string, boolean> = { w: false, s: false, arrowup: false, arrowdown: false };

      window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 's' || k === 'arrowup' || k === 'arrowdown') {
          keys[k] = true;
          if (k === 'arrowup' || k === 'arrowdown') e.preventDefault();
        }

        // for the pause button
        if (k === ' ' || k === 'escape') {
          e.preventDefault();
          const winnerOverlay = document.getElementById('winner-overlay');
          if (winnerOverlay) {
            winnerOverlay.remove();
            restartGame();
            return ;
          }
          togglePause();
        }
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 's' || k === 'arrowup' || k === 'arrowdown') keys[k] = false;
      });
  ////////////////////

      function togglePause() {
        gameRunning = !gameRunning;

        if (!gameRunning) {
          pauseOverlay.classList.remove('hidden');
          pauseOverlay.classList.add('flex');
          if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
          }
        } else {
          pauseOverlay.classList.add('hidden');
          pauseOverlay.classList.remove('flex');
          if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
          }
          if (!animationId) {
            last = performance.now();
            animationId = requestAnimationFrame(animate);
          }
        }
      }

      if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
      }
      if (resumeBtn) {
        resumeBtn.addEventListener('click', togglePause);
      }
      if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
      }
      if (quitBtn) {
        quitBtn.addEventListener('click', () => {
          navigate('/localMode');
          // console.log('Quit lacal game style');
        });
      }

      function restartGame() {
        player1Score = 0;
        player2Score = 0;
        updateScoreDisplay();

        resetGameBall();

        if (!gameRunning) {
          togglePause();
        }
        console.log('Game Restarting');
      }
/////////////////////////

      function drawMyScene() {
        // Drawing Midle line
        c.fillStyle = '#35C6DD66';
        c.fillRect(width / 2 - 1.5, 0, 3, height);

        // Drawing the paddles
        c.fillStyle = '#F40CA4';////////right paddle
        c.fillRect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);

        c.fillStyle = '#35C6DDCC';////////left paddle
        c.fillRect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
      }

      // Here I am changing the ft from CollitionWithPaddle() with no para. to CollitionWithPaddle(prevx, prevy, newx, newy) to calculating ball and paddles meet/collision using CCD contin.colli.detec.
      function CollitionWithPaddle(PrevX: number, PrevY: number, NewX: number, NewY: number) {
        // check if ball and baddle will meet between frames using prev and new positions
        // For the Right Paddle collision with the ball
        if (PrevX + ball.r <= paddleRightX && NewX + ball.r >= paddleRightX) {
          // as we now we will need the InterY to find it we first need to calculate t of collision So that t ∈ [0, 1]
          const t = (paddleRightX - (PrevX + ball.r)) / ((NewX + ball.r) - (PrevX + ball.r));
          const InterY = PrevY + (NewY - PrevY) * t;
          // Lastly check if the value of interY is whitin the paddle y axis:
          if (InterY >= paddleRightY - ball.r && InterY <= paddleRightY + paddleHeight + ball.r) {
            return { hitSide: 'right', InterY};
          }
        }
        // we'll redo the same for left paddle collision with ball
        if (PrevX - ball.r >= paddleLeftX + paddleWidth && NewX - ball.r <= paddleLeftX + paddleWidth) {
          const t = ((PrevX - ball.r) - (paddleLeftX + paddleWidth)) / ((PrevX - ball.r) - (NewX - ball.r) || 1);
          const InterY = PrevY + (NewY - PrevY) * t;
          if (InterY >= paddleLeftY - ball.r && InterY < paddleLeftY + paddleHeight + ball.r) {/// this condition here mean if all the ball including it's radius is in the paddle size to call it collision
            return { hitSide: 'left', InterY};
          }
        }
        return null;
      }

      function resetGameBall (MoveTo: boolean | null = null) {
        ball.x = width / 2;
        ball.y = height / 2;
        const InitSpeed = typeof MoveTo === 'boolean' ? 420 : 300;// Chosing Initial speed when reset playing or 300 if first time playing
        const angle = (Math.random() - 0.5) * (Math.PI / 6); // making a random degre btw ±15°
        const dir = typeof MoveTo === 'boolean' ? (MoveTo ? 1 : -1) : (Math.random() < 0.5 ? 1 : -1); // if a boolean value is entred si nn randomly right or left
        ball.vx = dir * InitSpeed * Math.cos(angle);
        ball.vy = InitSpeed * Math.sin(angle);
      }
////////******** */
      function predictBallY(): number | null {
        if (ball.vx <= 1) return null; // small threshold to avoid division by zero / near-zero

        const timeToReachPaddle = (paddleRightX - ball.x) / ball.vx;
        if (timeToReachPaddle <= 0) return null; // either already past or moving away

        return ball.y + ball.vy * timeToReachPaddle;
      }

      function updateAI(dt: number) {
        // Only start reacting once the ball crosses the canvas center (and ball moving toward AI)
        if (ball.x < (width / 2) + 150 || ball.vx <= 0) {
          // // optionally slowly return paddle to center when idle:
          // const idleTarget = height / 2 - paddleHeight / 2;
          // const toIdle = idleTarget - paddleRightY;
          // paddleRightY += Math.sign(toIdle) * Math.min(Math.abs(toIdle), PaddleSpeed * 0.3 * dt);
          // // clamp and return
          // paddleRightY = Math.max(0, Math.min(height - paddleHeight, paddleRightY));
          return;
        }

        const predictedY = predictBallY();
        if (predictedY === null) return;

        const targetCenterY = predictedY - paddleHeight / 2;
        const diff = targetCenterY - paddleRightY;

        const deadzone = 5;
        if (Math.abs(diff) <= deadzone) {
          paddleRightY = targetCenterY;
        } else {
          const speedFactor = 0.7; // Ai padding moving speed // or we'll call it later difficulty level
          const move = Math.sign(diff) * PaddleSpeed * speedFactor * dt;
          // if (Math.abs(move) > Math.abs(diff)) paddleRightY = targetCenterY; else  // just to not make a gitch in the paddle's movement
          paddleRightY += move;
        }
        paddleRightY = Math.max(0, Math.min(height - paddleHeight, paddleRightY));
      }
////////******** */

      resetGameBall();
      let last = performance.now(); // this one needed to calculate delta time(it's the time between frames)
      console.log('the last var is: ', last);

      function animate(now = performance.now()) {
        if (!gameRunning) {
          animationId = null;
          return;
        }

        const dt = Math.min((now - last) / 1000, 0.04);  // kan7sbo delta time li hia lwa9t bin kola frame w frame kan9smoh 3la 1000 to get the value in milliseconds // then kanakhdo l min value between time btw frames and 0.04 so always 0.04 is the max value can be chosing
        // console.log('the dt var is: ', dt);
        last = now; // update the last time value

        // move paddles
        if (keys['w'] && paddleLeftY > 0) paddleLeftY = Math.max(0, paddleLeftY - PaddleSpeed * dt); // kandrbo PaddleSpeed li hia 400 f dt bach twli mn second l pixel
        if (keys['s'] && paddleLeftY + paddleHeight < height) paddleLeftY = Math.min(height - paddleHeight, paddleLeftY + PaddleSpeed * dt);
        if (keys['arrowup'] && paddleLeftY > 0) paddleLeftY = Math.max(0, paddleLeftY - PaddleSpeed * dt);
        if (keys['arrowdown'] && paddleLeftY + paddleHeight < height) paddleLeftY = Math.min(height - paddleHeight, paddleLeftY + PaddleSpeed * dt);
        paddleRightY = Math.max(0, Math.min(height - paddleHeight, paddleRightY));

        updateAI(dt);

        const PrevX = ball.x;
        const PrevY = ball.y;
        const NewX = ball.x + ball.vx * dt;// following the rule : position' = position + velocity * dt; (to calculate value in px)
        const NewY = ball.y + ball.vy * dt;

        if (NewY - ball.r < 10 || NewY + ball.r > height - 10) {// if the ball hit my top or bottom barriers
          ball.vy = -ball.vy
        }

        // check paddle collision with ball using continuous detection alg from our CollitionWithPaddle function
        const collision = CollitionWithPaddle(PrevX, PrevY, NewX, NewY);
        if (collision) {// we have a hit repeat the ball hit a paddle
          let paddleCenterY: number;
          if (collision.hitSide === 'right') {
            paddleCenterY = paddleRightY + paddleHeight / 2;
          }
          else {
            paddleCenterY = paddleLeftY + paddleHeight / 2;
          }
          // So what we are doing here ladies and gentlemans we are seeing if the ball hit the paddle in the upper half or lower half why==> to decide how the angle of the ball will be after the hit/collision
          const relativeY = collision.InterY - paddleCenterY;
          // then had lvariable:relativeY ratwli btw -1 w 1 bach hit nrboha f langle de collision matkonch kbira bzaf
          const colliPoint = Math.max(-1, Math.min(1, relativeY / (paddleHeight / 2)));
          let bounceAngle = colliPoint * maxBounceAngle;// this condition is to makes edge hits produce steeper angles.
          if (bounceAngle > 1)///and here I am making them less steeper (if too steeper) this is when the ball hit the very corner angle
            bounceAngle -= 0.3;
          else if (bounceAngle < -1)
            bounceAngle += 0.3;
          console.log("the bounce Angle issss: ", bounceAngle);

          // we multiply by SpeedIncreasing to increase speed during the game
          const speed = Math.hypot(ball.vx, ball.vy) * SpeedIncreasing; // Math.hypot(a, b) returns the length of a 2D vector.////In other words:///It calculates the speed of something moving with horizontal velocity a and vertical velocity b. we now in hight school that` la vitesse = sqrt(a² + b²) this is exactly : ls vitesse = Math.hypot(ball.vx, ball.vy)`
          const CosA = Math.cos(bounceAngle);
          const SinA = Math.sin(bounceAngle);

          if (collision.hitSide === 'right') {
            ball.vx = -Math.abs(speed * CosA); // changing the velocity because both the speed and angle are changing
            ball.vy = speed * SinA;
            ball.x = paddleRightX - ball.r - 0.5; // avoid sticking by repositining the ball slightly outside paddle
          }
          else {
            ball.vx = Math.abs(speed * CosA)
            ball.vy = speed * SinA;
            ball.x = paddleLeftX + paddleWidth + ball.r + 0.5;
          }
          // ball.y = collision.InterY;// I update position after collision
        }
        else {// hh if nothing happened/ no collision simply updating the position of the ball x, y following the vx, vy we calculated
          ball.x = NewX;
          ball.y = NewY;
        }

        function displayWinner() {
          const winner = player1Score >= WINNING_SCORE ? "Salma" : "héhé Ai";
            const winnerOverlay = document.createElement('div');
            winnerOverlay.id = 'winner-overlay';
            winnerOverlay.className = 'ml-12 md:ml-0 w-[80%] md:w-full absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
            winnerOverlay.innerHTML = `
              <div class="bg-black p-10 rounded-2xl shadow-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
                <h2 class="text-2xl md:text-4xl font-glitch ${player1Score >= WINNING_SCORE ? 'text-primary' : 'text-secondary'} mb-4">🏆 ${winner} Wins! 🏆</h2>
                <p class="font-roboto text-xl md:text-2xl text-gray-300 mb-2">Final Score</p>
                <div class="flex justify-center items-center gap-8 mb-8">
                  <div class="text-center">
                    <p class="text-primary text-2xl md:text-3xl">${player1Score}</p>
                    <p class="font-roboto text-gray-400">You</p>
                  </div>
                  <span class="text-3xl text-white">-</span>
                  <div class="text-center">
                    <p class="text-secondary text-2xl md:text-3xl">${player2Score}</p>
                    <p class="font-roboto text-gray-400">Ai</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <button id="play-again-btn" class="text-[15px] md:text-xl w-[150px] md:w-[200px] py-3 bg-primary/80 hover:bg-primary text-white rounded-lg font-roboto transition-all duration-300">
                    <i class="fa-solid fa-rotate-right mr-2"></i>
                    Play Again
                  </button>
                  <button id="main-menu-btn" class="text-[15px] md:text-xl w-[150px] md:w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all duration-300">
                    <i class="fa-solid fa-home mr-2"></i>
                    Main Menu
                  </button>
                </div>
              </div>
            `;
            
            document.querySelector('#container')?.appendChild(winnerOverlay);

              const playAgainBtn = document.getElementById('play-again-btn');
              const mainMenuBtn = document.getElementById('main-menu-btn');
              
              if (playAgainBtn) {
                playAgainBtn.addEventListener('click', () => {
                  winnerOverlay.remove();
                  restartGame();
                });
              }
              
              if (mainMenuBtn) {
                mainMenuBtn.addEventListener('click', () => {
                  navigate('/localMode');
                });
              }
        }

        if (ball.x - ball.r > width) {
          player1Score++;
          updateScoreDisplay();
          if (player1Score >= WINNING_SCORE) {
            gameRunning = false;
            displayWinner();
          }
          resetGameBall(false);
        }
        else if (ball.x + ball.r < 0) {
          player2Score++;
          updateScoreDisplay();
          if (player2Score >= WINNING_SCORE) {
            gameRunning = false;
            displayWinner();
          }
          resetGameBall(true);
        }
        c.clearRect(0, 0, width, height);// clean my scene
        drawMyScene();// draw my scene

        // drawing the ball
        c.beginPath();
        c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        c.fillStyle = 'white'
        c.fill();
        c.strokeStyle = '#ccc';
        c.stroke();
        
        requestAnimationFrame(animate);
      }
      last = performance.now();
      requestAnimationFrame(animate);
    }
  }, 100);
}
