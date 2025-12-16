// frontend/src/pages/RemoteGame.ts
import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function RemoteGame() {
  if (!requiredAuth())
    return "";
  
  const game = {
    match: [{
      player1: {
        avatar: "/public/pink-girl.svg", // the user pic
        name: "Player 1",
        score: 0,
      }, 
      player2: {
        avatar: "/public/purple-girl.svg", // normally here should go the opponent profile pic
        name: "Player 2",
        score: 0, 
      },
    }],
  }; 
  
  return `
  <div class="relative w-full h-screen">
    <!-- Player Info & Score -->
    <div class="absolute flex top-[15%] md:top-[20%] lg:top-[23%] xl:top-[18%] left-[6%] md:left-[2%] lg:left-[11%] xl:left-[22%] md:translate-x-1/2">
        <img src="${game.match[0].player1.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player1.name} </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">${game.match[0].player1.score}</span>
        </div>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">${game.match[0].player2.score}</span>
        </div>
        <img src="${game.match[0].player2.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
    </div>
    <!-- GAME CANVAS AREA -->
    <div class="absolute top-[26%] lg:top-[37%] xl:top-[32%] md:top-[32%] left-[15%] w-[70%] h-[65%] lg:w-[70%] lg:h-[50%] xl:h-[60%] border-[#35C6DD]/40 rounded-3xl overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
      <!-- This is where the game will be drawn -->
      <canvas 
        id="gameCanvas"
        class="w-full h-full bg-black"
      ></canvas>
    </div>
    <!-- LEAVE GAME BUTTON -->
      <div class="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-10">
        <button id="leave-btn" class="px-6 py-3 bg-black hover:bg-secondary text-white border-secondary/40 overflow-hidden drop-shadow-pink rounded-lg font-roboto transition-all duration-300 flex items-center gap-2">
          Leave
        </button>
      </div>
    <!-- PAUSE OVERLAY (Hidden by default) -->
      <div id="leave-overlay" class="absolute inset-0 bg-black/80 z-20 hidden flex-col items-center justify-center">
        <div class="bg-black p-8 rounded-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
          <h2 class="text-3xl font-glitch tracking-[1px] leading-[5px] text-primary mb-5">Leave Match ?</h2>
          <p class="font-roboto text-gray-300 mb-10">Your progress for this match will be lost.</p>

            <button id="cancel-btn" class="w-[200px] py-3 bg-secondary/80 hover:bg-secondary text-white rounded-lg font-roboto transition-all duration-300">
              <i class="fa-solid fa-xmark mr-2"></i>
              Stay
            </button>
            
            <button id="quit-btn" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
              <i class="fa-solid fa-sign-out mr-2"></i>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

export function RemoteGameEventListener() {
  const socket = getGameSocket(localStorage.getItem("token"));
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  console.log(canvas.height);
  console.log(canvas.width);

  const LeaveOverlay = document.getElementById('leave-overlay') as HTMLDivElement;
  const quitBtn = document.getElementById('quit-btn') as HTMLButtonElement;
  // const cancelbtn = document.getElementById('cancel-btn') as HTMLButtonElement;

  socket.on("game_update", (gameState) => {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // B. Draw Ball (using data from server!)
    ctx.fillStyle = "#35C6DD";
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // C. Draw Paddles (Optional for this step, but easy to add)
    ctx.fillRect(10, gameState.paddle1.y, 10, 100); // Left Paddle
    ctx.fillRect(canvas.width - 20, gameState.paddle2.y, 10, 100); // Right Paddle
  });

  socket.on("game_over", () => {  
      alert("Game Over!");
      navigate("/home");
  });

  document.getElementById("leave-btn")?.addEventListener("click", () => {
    LeaveOverlay.classList.remove('hidden');
    LeaveOverlay.classList.add('flex');
  });
  if (quitBtn) {
    quitBtn.addEventListener('click', () => {
      socket.disconnect();
      navigate("/home");
    });
  }
  document.getElementById("cancel-btn")?.addEventListener("click", () => {
    LeaveOverlay.classList.remove('flex');
    LeaveOverlay.classList.add('hidden');
  });
}


// export function RemoteGameEventListener() {
//   const socket = getGameSocket(localStorage.getItem("token"));
//   const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
//   const ctx = canvas?.getContext("2d");

//   // 1. Draw Loop (Render what server sends)
//   socket.on("game_update", (gameState) => {
//     if (!ctx || !canvas) return;

//     // Clear
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw Ball
//     ctx.fillStyle = "#35C6DD";
//     ctx.beginPath();
//     ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
//     ctx.fill();

//     // --- NEW: Draw Paddles ---
//     ctx.fillStyle = "#FFFFFF";
//     // Paddle 1 (Left) - x=10, width=10, height=100
//     ctx.fillRect(10, gameState.paddle1.y, 10, 100); 
    
//     // Paddle 2 (Right) - x=780, width=10, height=100
//     ctx.fillRect(780, gameState.paddle2.y, 10, 100);
//   });

//   // 2. Input Handling (Send Keys to Server)
//   const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
//       // Only care about Arrow Keys (or W/S)
//       if (e.key === "ArrowUp" || e.key === "w") {
//           socket.emit('input_update', { input: 'UP', isPressed });
//       }
//       if (e.key === "ArrowDown" || e.key === "s") {
//           socket.emit('input_update', { input: 'DOWN', isPressed });
//       }
//   };

//   // Add Listeners
//   window.addEventListener('keydown', (e) => handleKey(e, true));
//   window.addEventListener('keyup', (e) => handleKey(e, false));

//   // Cleanup when leaving page (Important!)
//   return () => {
//      window.removeEventListener('keydown', (e) => handleKey(e, true));
//      window.removeEventListener('keyup', (e) => handleKey(e, false));
//   };
// }