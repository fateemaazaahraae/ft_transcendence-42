import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function RemoteGameStyle() {
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
      <div class="relative">
        <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
        <div id="notifBadge" class="absolute hidden top-1 inset-0 w-[7px] h-[7px] rounded-full bg-red-600"></div>
      </div>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>


    <!-- Wait opponent -->

    <h1 id="waitingText"
        class="text-3xl md:text-4xl lg:text-5xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[14%]">
      Waiting For Opponent<span id="dots">...</span>
    </h1>
    <div class="flex flex-col lg:flex-row justify-center items-center mt-[8%] lg:mt-[5%] gap-6 md:gap-10">
        <img src="" id="myImg" class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full border-2 border-primary object-cover">
        <img src="vs.svg" class="w-[90px] md:w-[150px] lg:w-[170px]" />
        <img
          id="opponentImg"
          src="opponent1.png"
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
    "dark-girl.svg",
    "white-boy2.svg",
    "pink-girl.svg",
    "purple-girl.svg",
    "red-boy.svg",
    "white-boy.svg",
    "green-girl.svg",
    "blue-boy.svg",
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

export function RemoteGameStyleEventListener() {
  window.addEventListener('popstate', () => {
  socket.emit("leave_queue");
  socket.disconnect();
  }); // user click back or forward in the browser
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
