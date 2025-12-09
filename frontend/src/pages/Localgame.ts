import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function LocalGame() {
  if (!requiredAuth())
    return "";
  
  const game = {
    match: [{
      player1: {
        avatar: "/public/pink-girl.svg",
        name: "Player 1",
        score: 0,
      }, 
      player2: {
        avatar: "/public/purple-girl.svg", 
        name: "Player 2",
        score: 0, 
      },
    }],
  }; 
  
  return `
  <div class="relative w-full h-screen">

    <!-- Top icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="arrow relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Player Info & Score -->
    <div class="absolute flex top-[15%] md:top-[20%] lg:top-[23%] xl:top-[18%] left-[6%] md:left-[2%] lg:left-[11%] xl:left-[22%] md:translate-x-1/2">
        <i class="object-cover fa-solid fa-circle-user text-[50px] md:text-[50px] lg:text-[120px] xl:text-[95px] text-primary/90"></i>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player1.name} </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">${game.match[0].player1.score}</span>
        </div>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">${game.match[0].player2.score}</span>
        </div>
        <i class="object-cover fa-solid fa-circle-user text-[50px] md:text-[50px] lg:text-[120px]  ml-[1%] md:ml-[3%] lg:ml-[10%] xl:text-[95px] text-secondary/75"></i>
    </div>



    <!-- GAME CANVAS AREA -->
    <div class="absolute top-[26%] lg:top-[37%] xl:top-[32%] md:top-[32%] left-[15%] w-[70%] h-[65%] lg:w-[70%] lg:h-[50%] xl:h-[60%] border-[#35C6DD]/40 rounded-3xl overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
      <!-- This is where the game will be drawn -->
      <canvas 
        id="pongCanvas"
        class="w-full h-full bg-black"
      ></canvas>
    </div>
  </div>
  `;
}

// To always remember
  //       y
  //       ↑
  //       |
  //       | 
  //  -----+----→ x

export function LocalGameEventListener() {
  setTimeout(() => {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        // navigate('/LocalgameStyle');
      });
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
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 's' || k === 'arrowup' || k === 'arrowdown') keys[k] = false;
      });

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
        const InitSpeed = 320;// Chosing Initial speed when reset playing
        const angle = (Math.random() - 0.5) * (Math.PI / 6); // making a random degre btw ±15°
        const dir = typeof MoveTo === 'boolean' ? (MoveTo ? 1 : -1) : (Math.random() < 0.5 ? 1 : -1); // if a boolean value is entred si nn randomly right or left
        ball.vx = dir * InitSpeed * Math.cos(angle);
        ball.vy = InitSpeed * Math.sin(angle);
      }

      resetGameBall();
      let last = performance.now(); // this one needed to calculate delta time(it's the time between frames)
      console.log('the last var is: ', last);
      function animate(now = performance.now()) {
        const dt = Math.min((now - last) / 1000, 0.04);  // kan7sbo delta time li hia lwa9t bin kola frame w frame kan9smoh 3la 1000 to get the value in milliseconds // then kanakhdo l min value between time btw frames and 0.04 so always 0.04 is the max value can be chosing
        // console.log('the dt var is: ', dt);
        last = now; // update the last time value

        // move paddles
        if (keys['w'] && paddleLeftY > 0) paddleLeftY = Math.max(0, paddleLeftY - PaddleSpeed * dt); // kandrbo PaddleSpeed li hia 400 f dt bach twli mn second l pixel
        if (keys['s'] && paddleLeftY + paddleHeight < height) paddleLeftY = Math.min(height - paddleHeight, paddleLeftY + PaddleSpeed * dt);
        if (keys['arrowup'] && paddleRightY > 0) paddleRightY = Math.max(0, paddleRightY - PaddleSpeed * dt);
        if (keys['arrowdown'] && paddleRightY + paddleHeight < height) paddleRightY = Math.min(height - paddleHeight, paddleRightY + PaddleSpeed * dt);

        const PrevX = ball.x;
        const PrevY = ball.y;
        const NewX = ball.x + ball.vx * dt;// following the rule : position' = position + velocity * dt; (to calculate value in px)
        const NewY = ball.y + ball.vy * dt;

        if (NewY - ball.r <= 0 || NewY + ball.r >= height) {// if the ball hit my top or bottom barriers
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

        if (ball.x - ball.r > width) {
          resetGameBall(false);
        }
        else if (ball.x + ball.r < 0) {
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
