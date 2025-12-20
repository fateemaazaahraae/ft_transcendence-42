import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function GameStyle() {
  if (!requiredAuth())
    return "";
  const match = {
      user: "/pink-girl.svg",
      player: "/purple-girl.svg",
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
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 left-3"></i>
        <input type="text" placeholder="Search for friends.." class="search-input font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[1px] border-primary/50">
        <div class="search-results absolute top-full left-0 w-full bg-black border border-primary/50 rounded-xl mt-1 hidden"></div>
      </div>
      <div class="arrow relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- chose your mode -->

    <div class="absolute top-[70%]  md:top-1/2 pb-[15%] md:pb-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <h1 class="font-glitch text-3xl md:text-4xl xl:text-6xl lg:text-5xl text-black leading-[1.9]"
       style="-webkit-text-stroke: 2px rgba(53,198,221,0.6);">Ready to play?</h1>
      <h1 class="font-glitch text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary/60 text-shadow-cyan">Pick your mode</h1>
      <div class="flex flex-col md:flex-col lg:flex-row xl:flex gap-10 lg:gap-5 xl:gap-20 mt-[20%] md:mt-[12%]">
        <div class="flex flex-col gap-2 md:gap-3 lg:gap-6 xl:gap-3 items-center w-[350px] h-[300px] md:w-[450px] md:h-[310px] lg:w-[500px] lg:h-[400px] xl:w-[600px] xl:h-[430px] bg-primary/60 rounded-3xl ">
            <h1 class="mt-[5%] font-glitch text-center text-2xl md:text-3xl lg:text-4xl"> One-on-One</h1>
            <div class="flex justify-center gap-3">
                <img src="${match.user}" 
                class=" object-cover w-[100px] h-[100px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] xl:w-[150px] xl:h-[150px] rounded-full border-[3px] border-[#35C6DD]/90"/>
                <img src="/vs.svg" class="w-[90px] md:w-[100px] lg:w-[120px]" />
                <i class="object-cover fa-solid fa-circle-user text-[100px] md:text-[100px] lg:text-[120px] xl:text-[150px] mt-[25%] text-primary/90"></i> 
            </div>
            <button id=play class=" w-[100px] md:w-[120px] h-[30px] font-roboto bg-secondary rounded-full">Play</button>
        </div>
        <div class="flex flex-col gap-9 md:gap-7 lg:gap-11 items-center w-[350px] h-[300px] md:w-[450px] md:h-[310px] lg:w-[500px] lg:h-[400px] xl:w-[600px] xl:h-[430px] bg-primary/60 rounded-3xl">
            <h1 class="mt-[5%] font-glitch text-center text-2xl md:text-3xl lg:text-4xl"> Tournament</h1>
            <div class="flex justify-center">
                <img src="/boys-team.svg" class="w-[120px] md:w-[150px] lg:w-[180px] xl:w-[200px]" />
                <img src="/golden_trophy.svg" class="w-[70px] md:w-[90px] lg:w-[120px] xl:w-[150px]"/>
                <img src="/girls-team.svg" class="w-[120px] md:w-[150px] lg:w-[180px] xl:w-[200px]" />
            </div>
            <button id=start class="w-[100px] md:w-[120px] h-[30px] font-roboto bg-secondary rounded-full">Start</button>
        </div>
      </div>
    </div>

  </div>
  `;
}

export function GameStyleEventListener(){
  const match=document.getElementById("play");
  match?.addEventListener("click", () =>{navigate("/game");
  });
  const tournament=document.getElementById("start");
  tournament?.addEventListener("click", () =>{navigate("/game");
  });
}

