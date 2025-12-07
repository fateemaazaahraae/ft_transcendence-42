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
          <span id="player1-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">0</span>
        </div>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">0</span>
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

export function LocalGameEventListener() {
  setTimeout(() => {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        navigate('/LocalgameStyle');
      });
    }
    
    // Get the canvas element
    const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement | null;
    if (canvas)
    {
      console.log("Canvas found! Ready to start game.");
      
      // The canvas size (height and width)
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      console.log(canvas.height);
      
      // Draw a simple test to see if canvas works
      const ctx = canvas.getContext('2d');/// the rectangle size is: hight: 580 and width: 1344
      if (ctx) {
        const c = ctx;
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        const width = canvas ? canvas.width : 0;
        const height = canvas ? canvas.height : 0;


        var paddleWidth = 10;
        var paddleHeight = 115;
        var paddleRightX = width - paddleWidth - 8;
        var paddleRightY = 345;
        var paddleLeftX = 8;
        var paddleLeftY = 350;
        function drawScene() {
          // Drawing Midle line
          c.fillStyle = '#35C6DD66';
          c.fillRect(width / 2, 0, 3, height);

          // c.fillStyle = '#fff';
          // c.fillRect(1330, 570, 10, 10);
          
          // Drawing the paddles
          c.fillStyle = '#F40CA4';////////right paddle
          c.fillRect(paddleRightX, paddleRightY, paddleWidth, paddleHeight); /// the 70 and 395 value should be variables

          c.fillStyle = '#35C6DDCC';////////right paddle
          c.fillRect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
        }

        function CollitionWithPaddle()
        {
          if ((x + 10 > paddleRightX &&  (y > paddleRightY && y < paddleRightY + paddleHeight))
              || x - 10 < paddleLeftX + paddleWidth && (y > paddleLeftY && y < paddleLeftY + paddleHeight))
          {
            console.log('It should have hit a paddle!!');
            return 1;
          }
          console.log('supositly it should not have hit a paddle!!');
          return 0;
        }

        let keys = {
          'w': false,
          's': false,
          'ArrowUp': false,
          'ArrowDown': false,
        }
        document.addEventListener('keydown', (e) => {
          if (e.key === 'w') keys['w'] = true;
          if (e.key === 's') keys['s'] = true;
          if (e.key === 'ArrowUp') keys['ArrowUp'] = true;
          if (e.key === 'ArrowDown') keys['ArrowDown'] = true;
        });
        document.addEventListener('keyup', (e) => {
          if (e.key === 'w') keys['w'] = false;
          if (e.key === 's') keys['s'] = false;
          if (e.key === 'ArrowUp') keys['ArrowUp'] = false;
          if (e.key === 'ArrowDown') keys['ArrowDown'] = false;
        });

        var mx = Math.random() < 0.5 ? 4 : -4;
        var my = Math.random() < 0.5 ? 4 : -4;

        function animate() {
          requestAnimationFrame(animate);
          c.clearRect(0, 0, width, height);
          drawScene();

          if (keys['w'] && paddleLeftY > 0) {
            paddleLeftY -= 4;
          }
          if (keys['s'] && paddleLeftY + paddleHeight < height) {
            paddleLeftY += 4;
          }
          if (keys['ArrowUp'] && paddleRightY > 0) {
            paddleRightY -= 4;
          }
          if (keys['ArrowDown'] && paddleRightY + paddleHeight < height) {
            paddleRightY += 4;
          }

          c.beginPath();
          c.arc(x, y, 10, 0, Math.PI * 2, false);
          c.fillStyle = 'white';
          c.fill();
          c.stroke();
          if (y + 10 > height || y - 10 < 0) {
            my = -my;
          }    ///// Condition for the right paddle         ///// Condition for the left paddle
          if (CollitionWithPaddle())
          {
            mx = -mx;
          }
          if (x - 10 > width || x + 10 < 0) { ///// add if the ball doesn't touch the paddle
            x = width / 2;
            y = height / 2; // Reset mx (horizontal speed)
            mx = Math.random() < 0.5 ? 5 : -5;
            my = Math.random() < 0.5 ? 5 : -5;
          }
          y += my;
          x += mx;
          // console.log('infinitly');
        }
        animate();
      }
    }
  }, 100);
}