import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function AiGame() {
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
        <img src="${game.match[0].player1.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player1.name} </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">0</span>
        </div>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">0</span>
        </div>
        <img src="${game.match[0].player2.avatar}" class="w-[60px] h-[60px] ml-[1%] md:ml-[3%] lg:ml-[10%] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-secondary object-cover border-[2px]"/>
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

export function AiGameEventListener() {
  setTimeout(() => {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        navigate('/LocalgameStyle');
      });
    }
    
    // Get the canvas element
    const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
    if (canvas) {
      console.log("Canvas found! Ready to start game With Ai.");
      
      // Set canvas size to match its display size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Draw a simple test to see if canvas works
      const ctx = canvas.getContext('2d');/// the rectangle size is: hight: 580 and width: 1060
      if (ctx) {
        // Drawing the paddles
        ctx.fillStyle = '#35C6DDCC';
        ctx.fillRect(6, 55, 10, 117);

        ctx.fillStyle = '#F40CA4';
        ctx.fillRect(1054, 400, 10, 117);

        ctx.fillStyle = '#35C6DD66';
        ctx.fillRect(530, 0, 3, 580);

        // draw next the middle line at 530 in the field (width size)
        
        // Draw test text
        // ctx.fillStyle = 'white';
        // ctx.font = '20px Arial';
        // ctx.fillText('Game Canvas Ready!', 100, 200);
      }
    }
  }, 100);
}
