import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function TrWaitingPlayers() {
  if (!requiredAuth())
    return "";
  return `
  <div class="relative w-full h-screen overflow-x-hidden">


    <!-- Controls Icons -->
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


    <!-- Wait opponent -->

    <h1 id="waitingText"
        class="text-3xl md:text-4xl lg:text-5xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[4%]">
      Waiting For Players<span id="dots">...</span>
    </h1>
    <h2 id="waitingText"
        class="text-3xl md:text-4xl lg:text-4xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[4%]">
      Tournament name
    </h2>
    <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[1%] gap-2 md:gap-[30px]">
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-2 md:gap-10">
              <img src="" id="myImg" class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] rounded-full border-2 border-primary object-cover">
              <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[120px]" />
              <img id="opponent2"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-primary object-cover
                      opacity-70 transition-opacity duration-300"
              />
          </div>
          <span class="text-white text-[30rem] font-serif font-light">}</span>
          <img id="opponent5" src="/public/default.png" class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] rounded-full border-2 border-primary object-cover">
      </div>
      <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[150px]" />
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
      <img id="opponent6" src="/public/default.png" class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] rounded-full border-2 border-secondary object-cover">
          <span class="text-white text-[30rem] font-serif">{</span>
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-2 md:gap-10">
              <img id="opponent3"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                      opacity-70 transition-opacity duration-300"
              />
              <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[120px]" />
              <img id="opponent4"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                      opacity-70 transition-opacity duration-300"
              />
          </div>
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

function startOpponentImageRotation() {
  const images = [
    "/public/dark-girl.svg",
    "/public/white-boy2.svg",
    "/public/pink-girl.svg",
    "/public/purple-girl.svg",
    "/public/red-boy.svg",
    "/public/white-boy.svg",
    "/public/green-girl.svg",
    "/public/blue-boy.svg",
  ];

  return setInterval(() => {
    const waitingImages = document.querySelectorAll(
      ".opponentImg.waiting"
    ) as NodeListOf<HTMLImageElement>;

    waitingImages.forEach((img) => {
      img.classList.add("opacity-0");

      setTimeout(() => {
        const random = Math.floor(Math.random() * images.length);
        img.src = images[random];
        img.classList.remove("opacity-0");
      }, 300);
    });
  }, 450);
}

async function fillSettingsPage()
{
  const userId = localStorage.getItem("userId");
  if (!userId) {
    // showAlert("Login first");
    navigate("/login");
    return ;
  }
  try
  {
    const res = await fetch(`http://localhost:3001/settings/${userId}`);
    const data = await res.json();
    
    // fill page
    (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
    // (document.getElementById("userName") as HTMLInputElement).value = data.userName || "";
  }
  catch (err)
  {
    console.log(err);
    showAlert("Error while fetching data: " + err);
  }
}

export function TrWaitingPlayersEventListener() {
  const socket = getTrSocket(localStorage.getItem("token"));
  window.addEventListener('popstate', () => {
    socket.emit("leave_queue");
    socket.disconnect();
    console.log("You left!!");
    // leaveGame();
  });
  fillSettingsPage();
  startWaitingDots();
  startOpponentImageRotation();
  socket.on("player_connected", (data) => {
    const slotId = `opponent${data.number}`;
    const img = document.getElementById(slotId) as HTMLImageElement;
    if (!img) return;
    console.log("a player connected with the pic: ", data.pic,
        "and number---> ", data.number);
    img.classList.remove("waiting");
    img.classList.add("locked");
    console.log("deeeebuging :::: ", data.pic);
    img.src = data.pic;
  });
  // function leaveGame() {
  //   console.log("You left!!");
  //   socket.disconnect();
  //   navigate("/gameStyle");
  // }
}
