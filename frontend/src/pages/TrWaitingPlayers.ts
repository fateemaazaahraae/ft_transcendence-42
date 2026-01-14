import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function TrWaitingPlayers() {
  if (!requiredAuth())
    return "";
  return `
  <div class="relative w-full h-screen overflow-x-hidden">

    <!-- Wait opponent -->
  <div class = "flex flex-col items-center justify-center mt-[20%] xl:mt-[10%] gap-10">
    <h1 data-i18n ="waitP" id="waitingText"
        class="font-glitch text-3xl md:text-4xl xl:text-6xl lg:text-5xl text-black leading-[1.9] "
       style="-webkit-text-stroke: 2px rgba(53,198,221,0.8);"">
      Waiting For Players<span id="dots">...</span>
    </h1>
    <h2 id="TrName" class="text-3xl md:text-4xl lg:text-4xl font-glitch"> </h2>
    </div>
    <div class="flex flex-row justify-center items-center md:mt-[3%] lg:mt-[1%] gap-5 md:gap-10 lg:gap-20">
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-4 md:gap-10">
              <img id="opponent1"
              src="/public/blue.png"
              class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] rounded-full border-2 border-primary object-cover">
              <img id="opponent2"
              src="/public/blue.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-primary object-cover
                       transition-opacity duration-300"
              />
          </div>
      </div>
      <div  class="flex items-center justify-center w-[120px] h-[120px] md:w-[130px] md:h-[130px] xl:w-[190px] xl:h-[190px] rounded-full drop-shadow-cyan " > 
							<img src="golden_trophy.svg" class=" w-[70px] md:w-[110px] lg:w-[150px] xl:w-[190px] mt-6 lg:mt-0" />
						</div>
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
  
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-4 md:gap-10">
              <img id="opponent3"
              src="/public/pink.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                       transition-opacity duration-300"
              />
              <img id="opponent4"
              src="/public/pink.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                       transition-opacity duration-300"
              />
          </div>
    </div>
  </div>
  `;
}


function startWaitingDots() {
  const dots = document.getElementById("dots");
  if (!dots) return;

  let count = 0;
  return setInterval(() => {
    count = (count + 1) % 4;
    dots.textContent = ".".repeat(count);
  }, 500);
}


export function TrWaitingPlayersEventListener() {
  let tournamentId: string | undefined;
  const socket = getTrSocket(localStorage.getItem("token"));
  startWaitingDots();
  window.addEventListener('popstate', () => {
    socket.emit("leave_queue", { tournamentId });
    socket.disconnect();/////////
    console.log("You left!!");
  });

  function clearOpponent(id: string) {
    const img = document.getElementById(id) as HTMLImageElement | null;
    if (img) img.src = "/public/blue.png";
  }
  function clearOpponent2(id: string) {
    const img = document.getElementById(id) as HTMLImageElement | null;
    if (img) img.src = "/public/pink.png";
  }

  function setOpponent(id: string, src: string) {
    const img = document.getElementById(id) as HTMLImageElement | null;
    if (!img) return;

    img.src = src;
    img.classList.remove("waiting", "opacity-60");
    img.classList.add("locked", "opacity-100");
  }


  socket.on("startWaitFinal", (data: any) => {
    if (!Array.isArray(data.avatars)) return;
    hasReceivedGameData = true;

    for (let i = 1; i <= 6; i++) {
      if (i === 1 || i === 2)  {
        clearOpponent(`opponent${i}`);
      } else {
        clearOpponent2(`opponent${i}`);
      }
    }

    data.avatars.slice(0, 4).forEach((avatar: string, i: number) => {
      setOpponent(`opponent${i + 1}`, avatar);
    });

    if (data.avatars.length < 5) return;

    if (data.avatars.length === 5) {
      const finalSlot = data.WinnerSide === 1 ? "opponent5" : "opponent6";
      setOpponent(finalSlot, data.avatars[4]);
    }

    if (data.avatars.length === 6) {
      if (data.WinnerSide === 1) {
        setOpponent("opponent5", data.avatars[5]);
        setOpponent("opponent6", data.avatars[4]);
      } else {
        setOpponent("opponent6", data.avatars[5]);
        setOpponent("opponent5", data.avatars[4]);
      }
    }
  });

  socket.on("update_avatars", (data: any) => {
    if (!Array.isArray(data.avatars)) return;


    for (let i = 1; i <= 4; i++) {
      if (i === 1 || i === 2)  {
        clearOpponent(`opponent${i}`);
      } else {
        clearOpponent2(`opponent${i}`);
      }
    }

    data.avatars.forEach((avatar: string, index: number) => {
      // if (index === 0) return;

      const img = document.getElementById(`opponent${index + 1}`) as HTMLImageElement;
      if (!img) return;

      img.classList.remove("waiting", "opacity-60");
      img.classList.add("locked", "opacity-100");
      img.src = avatar;
    });
  });

  function leaveGame() {
    console.log("someone left!!");
    // socket.emit('leave_game');
  }


  function cleanupGame() {
    socket.off();
    socket.disconnect();

    window.removeEventListener("popstate", leaveGame);
  }

  socket.off("start_final_game");

  socket.on("start_final_game", (data: any) => {
    hasReceivedGameData = true;
    console.log("🎉 MATCH Fiiiiiiiiiiinal!...");
    localStorage.setItem("LastMatch", JSON.stringify(data));
    navigate("/FinalMatchTr");
  });

  socket.on("match_found1", (data: any) => {
    console.log("🎉 MATCH FOUND!...");
    localStorage.setItem("currentMatch1", JSON.stringify(data));
    navigate("/tournamentgame"); 
  });

  socket.on("match_found2", (data: any) => {
    console.log("🎉 MATCH FOUND!...");
    localStorage.setItem("currentMatch2", JSON.stringify(data));
    navigate("/tournamentgametwo"); 
  });
  
  let hasReceivedGameData = false;

  socket.on("player_connected", (data: any) => {
    if (data.number === 0) {
      hasReceivedGameData = false;
    } else {
      hasReceivedGameData = true;
    }
    tournamentId = data.tournamentId;
    const slotId = `opponent${data.number}`;
    const img = document.getElementById(slotId) as HTMLImageElement;
    if (!img) return;
    console.log("a player connected with the pic: ", data.pic,
        "and number---> ", data.number);
    img.classList.remove("waiting");
    img.classList.add("locked");
    img.src = data.pic;
    (document.getElementById("TrName") as HTMLElement).textContent = data.tourName || "";
    function updateOpponent(index: number, avatar: string) {
      const el = document.getElementById(`opponent${index}`)

      if (!(el instanceof HTMLImageElement)) return

      el.classList.remove("waiting", "opacity-60");
      el.classList.add("locked", "opacity-100");
      el.src = avatar
    }
    const opponentCount = Math.min(data.number - 1, data.avatars.length)
    for (let i = 0; i < opponentCount; i++) {
      updateOpponent(i + 1, data.avatars[i])
    }
      setTimeout(() => {
      if (!hasReceivedGameData) {
        console.log("No active game found (likely refreshed). Redirecting...");
        showAlert("Game session lost or finished.");
        navigate("/home");
      }
    }, 1500);
  });


}
