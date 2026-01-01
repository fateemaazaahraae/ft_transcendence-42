import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function RemoteGame() {
  if (!requiredAuth()) return "";
  
  // 1. Get the data we saved in Home.ts
  const matchDataString = localStorage.getItem("currentMatch");
  
  // Default fallback (in case of refresh or error)
  let p1 = { name: "Player 1", avatar: "/public/dark-girl.svg", score: 0 };
  let p2 = { name: "Player 2", avatar: "/public/purple-girl.svg", score: 0 };

  if (matchDataString) {
      const matchData = JSON.parse(matchDataString);
      p1 = { ...p1, ...matchData.player1 }; // Merge defaults with real data
      p2 = { ...p2, ...matchData.player2 };
  } 
  
  return `
  <div id="container" class="relative w-full h-screen">
    <!-- Player Info & Score -->
    <div class="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 md:gap-4 lg:gap-60 top-[25%] md:top-[23%] xl:top-[18%]">
      <div class="flex items-center justify-end w-[260px]">
        <img src="${p1.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-1 md:gap-3">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${p1.name} </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">${p1.score}</span>
        </div>
      </div>
      <div class="flex items-center justify-start w-[260px]">
        <div class="flex flex-col items-center gap-1 md:gap-3">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${p2.name} </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">${p2.score}</span>
        </div>
        <img src="${p2.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
      </div>
    </div>
    <!-- GAME CANVAS AREA -->
    <div class="absolute left-1/2 transform -translate-x-1/2 rotate-90 lg:rotate-0 top-[43%] lg:top-[37%] xl:top-[32%] md:top-[38%] h-[38%] md:h-[55%] w-full md:w-[80%] lg:w-[70%] lg:h-[50%] xl:h-[60%] border-[#35C6DD]/40 rounded-3xl overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
      <!-- This is where the game will be drawn -->
      <canvas 
        id="gameCanvas"
        class="w-full h-full bg-black"
      ></canvas>
    </div>
    <!-- LEAVE GAME BUTTON -->
      <div class="absolute top-[15%] lg:top-[10%] left-1/2 transform -translate-x-1/2 z-10">
        <button id="leave-btn" class="px-6 py-3 bg-black hover:bg-secondary text-white border-secondary/40 overflow-hidden drop-shadow-pink rounded-lg font-roboto transition-all duration-300 flex items-center gap-2">
          Leave
        </button>
      </div>
    <!-- PAUSE OVERLAY (Hidden by default) -->
      <div id="leave-overlay" class="absolute inset-0 bg-black/50 z-[100] hidden flex-col items-center justify-center">
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
    <!-- PAUSE OVERLAY (Hidden by default) -->
      <div id="game-over-modal" class="hidden absolute inset-0 bg-black/80 flex-col justify-center items-center z-50">
        <h1 id="game-result-title" class="text-6xl font-glitch mb-4">GAME OVER</h1>
        <p id="final-score" class="text-2xl mb-8 font-mono">5 - 3</p>
        <button id="go-home-btn" class="px-8 py-3 bg-[#35C6DD] text-black font-bold rounded hover:bg-white transition">
          Back to Home
        </button>
      </div>
      </div>
    </div>
    `;
  }

export function RemoteGameEventListener() {
  const socket = getGameSocket(localStorage.getItem("token"));
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");
  
  let player1Score = 0;
  let player2Score = 0;
  const WINNING_SCORE = 3;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  console.log(canvas.height);
  console.log(canvas.width);

  const LeaveOverlay = document.getElementById('leave-overlay') as HTMLDivElement;
  const quitBtn = document.getElementById('quit-btn') as HTMLButtonElement;
  // const cancelbtn = document.getElementById('cancel-btn') as HTMLButtonElement;
  const player1ScoreDisplay = document.getElementById('player1-score-display') as HTMLSpanElement;
  const player2ScoreDisplay = document.getElementById('player2-score-display') as HTMLSpanElement;
  // const scoreP1 = document.getElementById("score-p1");
  // const scoreP2 = document.getElementById("score-p2");
  const modal = document.getElementById("game-over-modal");
  const resultTitle = document.getElementById("game-result-title");
  const finalScoreText = document.getElementById("final-score");

  function updateScoreDisplay() {
    if (player1ScoreDisplay) player1ScoreDisplay.textContent = player1Score.toString();
    if (player2ScoreDisplay) player2ScoreDisplay.textContent = player2Score.toString();
  }

  socket.on("game_update", (gameState) => {// listen for a socket.emit('game_update') with the new positions
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white'
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    ctx.fillStyle = '#35C6DD66';
    ctx.fillRect(canvas.width / 2 - 1.5, 0, 3, canvas.height);
    
    ctx.fillStyle = '#35C6DDCC';////////left paddle
    ctx.fillRect(8, gameState.paddle1.y, 10, 115);

    ctx.fillStyle = '#F40CA4';////////right paddle
    ctx.fillRect(canvas.width - 18, gameState.paddle2.y, 10, 115);


    function displayWinner() {
    // const myId = localStorage.getItem("userId");
    // const isWinner = data.winner === myId;
    const winner = player1Score >= WINNING_SCORE ? "salma" : "salma2";
    // const winnerAvatar = player1Score >= WINNING_SCORE ? ${game.match[0].player1.avatar} : ${game.match[0].player2.avatar};
    const winnerOverlay = document.createElement('div');
    winnerOverlay.id = 'winner-overlay';
    winnerOverlay.className = 'absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
    winnerOverlay.innerHTML = `
      <div class="bg-black p-10 rounded-2xl shadow-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
        <h2 class="text-3xl font-glitch ${player1Score >= WINNING_SCORE ? 'text-primary' : 'text-secondary'} mb-4">🏆 YOU WON! 🏆</h2>
        <div class="flex justify-center items-center mb-8">
          <img src="/public/purple-girl.svg" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
            <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
              <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px] mt-4"> ${winner} </h1>
            </div>
        </div>
        <div class="space-y-4 mt-10">
          <button id="quit" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
            <i class="fa-solid fa-sign-out mr-2"></i>
            Exit
          </button>
        </div>
      </div>
    `;
    
        document.querySelector('#container')?.appendChild(winnerOverlay);

          const ExitBtn = document.getElementById('quit');

          
          if (ExitBtn) {
            ExitBtn.addEventListener('click', () => {
              navigate('/home');
            });
          }
    }

    if (gameState.score.p1 > player1Score) {
      player1Score++;
      updateScoreDisplay();
      if (player1Score >= WINNING_SCORE) {
        // displayWinner();
      }
    }
    if (gameState.score.p2 > player2Score) {
      player2Score++;
      updateScoreDisplay();
      if (player2Score >= WINNING_SCORE) {
        // displayWinner();
      }
    }
    // if (gameState.score.p1 >= WINNING_SCORE || gameState.score.p2 >= WINNING_SCORE) {
    //     displayWinner();
    // }
    // ctx.fillRect(10, gameState.paddle1.y, 10, 100); // Left Paddle
    // ctx.fillRect(canvas.width - 20, gameState.paddle2.y, 10, 100); // Right Paddle
  });

  socket.on("game_over", (data) => {
      const myId = localStorage.getItem("userId");
      console.log('we have a winnnner!!!');
      console.log(myId);
      console.log(data.winner);
      const isWinner = data.winner === myId;

      if (data.reason === 'opponent_disconnected') {
        const winnerOverlay = document.createElement('div');
            winnerOverlay.id = 'winner-overlay';
            winnerOverlay.className = 'absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
            winnerOverlay.innerHTML = `
              <div class="bg-black p-10 rounded-2xl shadow-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
                <h3 class="text-3xl font-glitch text-secondary mb-3">🏆 YOU WON! 🏆</h3>
                <h2 class="text-green" mb-5> Your Opponent Left The Game </h2>
                <div class="flex flex-col justify-center items-center mt-8">
                  <img src="/public/purple-girl.svg" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
                    <div class="flex flex-row items-center">
                      <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px] mt-4"> salma </h1>
                    </div>
                </div>
                <h1 class="text-green"> WINNER </h1>
                <div class="space-y-4 mt-10">
                  <button id="quit" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
                    <i class="fa-solid fa-sign-out mr-2"></i>
                    Exit
                  </button>
                </div>
              </div>
            `;
    
            document.querySelector('#container')?.appendChild(winnerOverlay);
            document.getElementById("quit")?.addEventListener("click", () => {
              navigate("/home");
            });
      }
      else if (modal && resultTitle && finalScoreText) {
          // modal.classList.remove("hidden");
          // modal.classList.add("flex"); // Show modal

          if (isWinner) {
            const winnerOverlay = document.createElement('div');
            winnerOverlay.id = 'winner-overlay';
            winnerOverlay.className = 'absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
            winnerOverlay.innerHTML = `
              <div class="bg-black p-10 rounded-2xl shadow-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
                <h3 class="text-3xl font-glitch text-secondary mb-3">🏆 YOU WON! 🏆</h3>
                <h1 class="text-green" mb-4> WINNER </h1>
                <div class="flex flex-col justify-center items-center mb-8">
                  <img src="/public/purple-girl.svg" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
                    <div class="flex flex-row items-center">
                      <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px] mt-4"> salma </h1>
                    </div>
                </div>
                <div class="space-y-4 mt-10">
                  <button id="quit" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
                    <i class="fa-solid fa-sign-out mr-2"></i>
                    Exit
                  </button>
                </div>
              </div>
            `;
    
            document.querySelector('#container')?.appendChild(winnerOverlay);
            document.getElementById("quit")?.addEventListener("click", () => {
              navigate("/home");
            });
          } else {
              const winnerOverlay = document.createElement('div');
              winnerOverlay.id = 'winner-overlay';
              winnerOverlay.className = 'absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
              winnerOverlay.innerHTML = `
                <div class="bg-black p-10 rounded-2xl shadow-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
                  <h3 class="text-3xl font-glitch text-primary mb-3">💀 YOU LOST! 💀</h3>
                  <h1 class="text-green" mb-4> WINNER </h1>
                  <div class="flex flex-col justify-center items-center mb-8">
                    <img src="/public/purple-girl.svg" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
                      <div class="flex flex-row items-center">
                        <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px] mt-4"> salma </h1>
                      </div>
                  </div>
                  <div class="space-y-4 mt-10">
                    <button id="quit" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
                      <i class="fa-solid fa-sign-out mr-2"></i>
                      Exit
                    </button>
                  </div>
                </div>
              `;
              
              document.querySelector('#container')?.appendChild(winnerOverlay);
              document.getElementById("quit")?.addEventListener("click", () => {
                navigate("/home");
              });
            }
            finalScoreText.innerText = `${data.score.p1} - ${data.score.p2}`;
        }
      
      // Clean up socket listener so we don't duplicate logic
      // socket.off("game_update"); // Optional cleanup
  });

  // socket.on("game_over", () => {  
  //     alert("Game Over!");
  //     navigate("/home");
  // });


  const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
      if (e.key === "ArrowUp" || e.key === "w") {
          socket.emit('input_update', { input: 'UP', isPressed });
      }
      if (e.key === "ArrowDown" || e.key === "s") {
          socket.emit('input_update', { input: 'DOWN', isPressed });
      }
  };

  window.addEventListener('keydown', (e) => handleKey(e, true));
  window.addEventListener('keyup', (e) => handleKey(e, false));
  function leaveGame() {
    console.log("someone left!!");
    socket.emit('leave_game');
  }

  window.addEventListener('popstate', leaveGame);
  window.addEventListener('beforeunload', leaveGame);

  
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

  let hasReceivedGameData = false;

  socket.once("game_update", () => {
      hasReceivedGameData = true;
  });

  setTimeout(() => {
      if (!hasReceivedGameData) {
          console.log("⚠️ No active game found (likely refreshed). Redirecting...");
          alert("Game session lost or finished.");
          navigate("/home");
      }
  }, 1500);

  return () => {
     window.removeEventListener('keydown', (e) => handleKey(e, true));
     window.removeEventListener('keyup', (e) => handleKey(e, false));
  };
}
