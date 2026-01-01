import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function LocalGameStyle() {
  if (!requiredAuth())
    return "";
  const match = {
      user: "/public/pink-girl.svg",
      player: "/public/purple-girl.svg",
  };
  return `
  <div class="relative w-full h-screen overflow-x-hidden">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <div data-path="/home" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
        <i class="fa-solid fa-house text-[18px] text-black"></i>
      </div>
      <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/friends" class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/settings" class="fa-solid fa-gear text-primary hover:text-secondary transition-all duration-400 ease-in-out text-[18px]"></i>

    </aside>


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
        class="text-3xl  md:text-4xl lg:text-5xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[14%]">
      Waiting For Opponent<span id="dots">...</span>
    </h1>
    <div class="flex justify-center items-center mt-[5%] gap-10">
        <img src="" id="myImg" class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full border-2 border-primary object-cover">
        <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[170px]" />
        <img
          id="opponentImg"
          src="/public/opponent1.png"
          class="w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                lg:w-[250px] lg:h-[250px]
                rounded-full border-2 border-secondary object-cover
                opacity-80 transition-opacity duration-300"
        />
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
  const opponentImg = document.getElementById("opponentImg") as HTMLImageElement;
  if (!opponentImg) return;

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

  let index = 0;

  return setInterval(() => {
    opponentImg.classList.add("opacity-0");

    setTimeout(() => {
      index = (index + 1) % images.length;
      opponentImg.src = images[index];
      opponentImg.classList.remove("opacity-0");
    }, 300);
  }, 400);
}

async function fillSettingsPage()
{
  const userId = localStorage.getItem("userId");
  if (!userId) {
    showAlert("Login first");
    navigate("/login");
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

export function RemoteGameStyleEventListener() {
  window.addEventListener('popstate', leaveGame); // user click back or forward in the browser
  fillSettingsPage();
  startWaitingDots();
  startOpponentImageRotation();
  const socket = getGameSocket(localStorage.getItem("token"));
  function leaveGame() {
    console.log("You left!!");
    socket.disconnect();
    navigate("/gameStyle");
  }
}
