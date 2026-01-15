import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function RemoteGameStyle() {
  if (!requiredAuth())
    return "";
  return `
  <div class="relative w-full h-screen overflow-x-hidden">

    <!-- Wait opponent -->

    <h1 data-i18n= "wait" id="waitingText"
        class="text-xl md:text-3xl lg:text-5xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[14%]">
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
