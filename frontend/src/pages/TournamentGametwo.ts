// import { getGameSocket } from "../utils/gameSocket.ts";
import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";
import { showAlert } from "../utils/alert.ts";
import { match } from "node:assert";

export default function TournamentGametwo() {
  if (!requiredAuth()) return "";
  let p1 = { score: 0 };// Adding score
  let p2 = { score: 0 };

  return `
  <div id="container" class="relative w-full h-screen">
    <div class="absolute flex top-[15%] md:top-[20%] lg:top-[23%] xl:top-[18%] left-[6%] md:left-[2%] lg:left-[11%] xl:left-[22%] md:translate-x-1/2">
        
        <img src="" id="myImg" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
          <h1 id="userName" class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> </h1>
          <span id="player1-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann">${p1.score}</span>
        </div>

        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 id="userName2" class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> </h1>
          <span id="player2-score-display" class="w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink">${p2.score}</span>
        </div>

        <img src="" id="myImg2" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-secondary/80 object-cover border-[2px]"/>
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
      </div>
    </div>
    `;
  }

export async function fillSettingsPage()
{
  const cachedData = localStorage.getItem("currentMatch2");
  if (cachedData) {
    const match = JSON.parse(cachedData);
    const userId = match.player3.id;
    const userId2 = match.player4.id;
    const Nick1 = match.Nickname3;
    const Nick2 = match.Nickname4;
    if (!userId || !userId2) {
      showAlert("Login first");
      navigate("/login");
    }
    try
    {
      const res = await fetch(`http://localhost:3001/settings/${userId}`);
      const data = await res.json();
      // fill page
      (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
      (document.getElementById("userName") as HTMLElement).textContent = Nick1 || "";


      const res2 = await fetch(`http://localhost:3001/settings/${userId2}`);
      const data2 = await res2.json();
      // fill page
      (document.getElementById("myImg2") as HTMLImageElement).src = data2.profileImage || "";
      (document.getElementById("userName2") as HTMLElement).textContent = Nick2 || "";
    }
    catch (err)
    {
      console.log(err);
      showAlert("Error while fetching data: " + err);
    }
  }
}

export async function winnerdata(winner: any) {
  try
    {
      const res = await fetch(`http://localhost:3001/settings/${winner}`);
      const data = await res.json();
      const profileImage = data.profileImage || "";
      const userName = data.userName || "";

      return {profileImage, userName};
      
      // (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
      // (document.getElementById("userName") as HTMLElement).textContent = data.userName || "";
    }
    catch (err)
    {
      console.log(err);
      showAlert("Error while fetching data: " + err);
      return { profileImage: "", userName: "" };
    }
}

export async function TournamentGametwoEventListener() {
  fillSettingsPage();
  const socket = getTrSocket(localStorage.getItem("token"));
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");
  
  let player1Score = 0;
  let player2Score = 0;
  const WINNING_SCORE = 3;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const LeaveOverlay = document.getElementById('leave-overlay') as HTMLDivElement;
  const quitBtn = document.getElementById('quit-btn') as HTMLButtonElement;
  const player1ScoreDisplay = document.getElementById('player1-score-display') as HTMLSpanElement;
  const player2ScoreDisplay = document.getElementById('player2-score-display') as HTMLSpanElement;
  // const modal = document.getElementById("game-over-modal");
  // const resultTitle = document.getElementById("game-result-title");
  // const finalScoreText = document.getElementById("final-score");

  function updateScoreDisplay() {
    if (player1ScoreDisplay) player1ScoreDisplay.textContent = player1Score.toString();
    if (player2ScoreDisplay) player2ScoreDisplay.textContent = player2Score.toString();
  }

  socket.on("game_update", (gameState: any) => {// listen for a socket.emit('game_update') with the new positions
    if (!ctx || !canvas) return;
    console.log()

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white'
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    ctx.fillStyle = '#35C6DD66';
    ctx.fillRect(canvas.width / 2 - 1.5, 0, 3, canvas.height);
    
    ctx.fillStyle = '#35C6DDCC'; //left paddle
    ctx.fillRect(8, gameState.paddle1.y, 10, 115);

    ctx.fillStyle = '#F40CA4'; //right paddle
    ctx.fillRect(canvas.width - 18, gameState.paddle2.y, 10, 115);

    if (gameState.score.p1 > player1Score) {
      player1Score++;
      updateScoreDisplay();
      if (player1Score >= WINNING_SCORE) {
      }
    }
    if (gameState.score.p2 > player2Score) {
      player2Score++;
      updateScoreDisplay();
      if (player2Score >= WINNING_SCORE) {
      }
    }
  });
  function cleanupGame() {
    socket.off();
    socket.disconnect();

    document.getElementById("winner-overlay")?.remove();
    document.getElementById("leave-overlay")?.classList.add("hidden");

    window.removeEventListener("popstate", leaveGame);
    window.removeEventListener("beforeunload", leaveGame);
  }

  socket.once("game_over", (data: any) => {
      const myId = localStorage.getItem("userId");
      const isWinner = data.winner === myId;
      let h3ColorClass: string;
      let h3Text: string;
      let HeaderMsg: string;

      winnerdata(data.winner).then(Info => {
      if (data.reason === 'opponent_disconnected' ||
        (isWinner)
      ) {
        h3Text = "🏆 YOU WON! 🏆"
        h3ColorClass = "text-secondary";
      }
      else {
        h3Text = "💀 YOU LOST! 💀"
        h3ColorClass = "text-primary";
      }
      if (data.reason === 'opponent_disconnected')
      {
        HeaderMsg = "Your Opponent Left The Game";
      } else {
        HeaderMsg = ""
      }
      
      
      const cachedData = localStorage.getItem("currentMatch1");
      let finalWinnerNickname = Info.userName;
      if (cachedData) {
        const match = JSON.parse(cachedData);
        if (match.player1 && match.player1.id === data.winner) {
          finalWinnerNickname = match.Nickname1;
        } else if (match.player2 && match.player2.id === data.winner) {
          finalWinnerNickname = match.Nickname2;
        }
      }
      if (!isWinner) {
        const winnerOverlay = document.createElement('div');
        winnerOverlay.id = 'winner-overlay';
        winnerOverlay.className = 'absolute inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center';
        winnerOverlay.innerHTML = `
          <div class="bg-black p-10 rounded-2xl border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] max-w-md w-[90%] text-center">
            <h3 class="text-3xl font-glitch ${h3ColorClass} mb-3">${h3Text}</h3>
            <h2 class="text-green" mb-5>${HeaderMsg}</h2>
            <h1 class="text-green text-bold" mb-4>WINNER IS</h1>
            <div class="flex flex-col justify-center items-center mt-[10%]">
              <img src="${Info.profileImage}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
            </div>
            <div class="space-y-4 mt-10">
              <button id="quit-game-btn" class="w-[200px] py-3 bg-black border-primary/40 overflow-hidden shadow-[0_0_15px_5px_rgba(0,255,255,0.5)] text-white rounded-lg font-roboto transition-all mt-7 duration-300">
                <i class="fa-solid fa-sign-out mr-2"></i>
                Exit
              </button>
            </div>
          </div>
        `;
        
        
        document.querySelector('#container')?.appendChild(winnerOverlay);
        document.getElementById("quit-game-btn")?.addEventListener("click", () => {
          cleanupGame();
          navigate("/home");
        });
      } else {
        document.getElementById("winner-overlay")?.remove();
        document.getElementById("leave-overlay")?.classList.add("hidden");

        window.removeEventListener("popstate", leaveGame);
        window.removeEventListener("beforeunload", leaveGame);
        socket.emit("GoToFinal", { winnerNickname: finalWinnerNickname });
        navigate("/TrWaitingPlayers");
      }
    });
  });

  const handleKey = (e: KeyboardEvent, isPressed: boolean) => {
      if (e.key === "ArrowUp" || e.key === "w") {
          socket.emit('input_update', { input: 'UP', isPressed });
      }
      if (e.key === "ArrowDown" || e.key === "s") {
          socket.emit('input_update', { input: 'DOWN', isPressed });
      }
  };

  const onKeyDown = (e: KeyboardEvent) => handleKey(e, true);
  const onKeyUp = (e: KeyboardEvent) => handleKey(e, false);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
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
      leaveGame();
      cleanupGame();
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
      console.log("No active game found (likely refreshed). Redirecting...");
      showAlert("Game session lost or finished.");
      navigate("/home");
    }
  }, 1500);

  return () => {
    socket.off("game_update");
    socket.off("game_over");
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('keydown', (e) => handleKey(e, true));
    window.removeEventListener('keyup', (e) => handleKey(e, false));
    window.removeEventListener('popstate', leaveGame);
    window.removeEventListener('beforeunload', leaveGame);
    
    if (socket.connected) {
      socket.disconnect();
    }
  };
}
