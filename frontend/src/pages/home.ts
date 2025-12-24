
import { getSavedLang } from "../i18n/index.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";
import { loadUser } from "../utils/loadUser.ts";

export default async function Home() {
  let user:any;
  try{
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");
    if (token)
    {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/home");
    }
    if (!token)
      token = localStorage.getItem("token");
   const res = await fetch("http://localhost:3000/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    user = data.user;
    localStorage.setItem("userId", data.user.id);
  }
  catch
  {
    console.log("fetch user/me error");
    navigate("/login");
  }

  const currentLang = (await getSavedLang()).toUpperCase();

  return `
<div class="relative w-full h-screen overflow-x-hidden px-6">

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
        <input type="text" placeholder="Search for friends.." class="search-input font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[2px] border-primary/70">
        <div class="search-results absolute top-full left-0 w-full h-auto backdrop-blur-md mt-1 hidden z-[9000] rounded-xl"></div>
      </div>
      <div class="arrow relative group">
        <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          ${currentLang}
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

       <!-- HOME -->
  <div class ="relative flex lg:flex-row flex-col justify-center items-center lg:left-[7%] xl:left-0 top-[20%]">
   <div class="flex justify center items-center">
      <!-- Avatar -->
      <img 
        src="${user.profileImage}"
        class="object-cover w-[110px] h-[110px] md:w-[150px] md:h-[150px] xl:w-[220px] xl:h-[220px] rounded-full border-[3px] border-[#35C6DD]"
      >

      <!-- Info Section -->
      <div class="flex flex-col ml-[5%] md:ml-[3%] xl:ml-[60px] lg:gap-[8%] xl:gap-[10px]">
          <h1 class="text-white font-glitch text-xl md:text-2xl xl:text-4xl">${user.firstName} ${user.lastName}</h1>
          <h1 class="text-white font-roboto text-[14px] md:text-[16px] xl:text-xl">${user.userName}</h1>
          <div class="lg:gap-3 xl:gap-6 lg:mt-[5%] xl:mt-[10%]">
            <div class="flex text-white font-roboto justify-between text-[10px] md:text-[13px] w-[210px] md:w-[300px] xl:w-[400px]">
              <p>Level</p>
              <p>"7.5%"</p>
            </div>

            <div class="w-[210px] h-[5px] md:w-[300px] md:h-[8px] xl:w-[400px] xl:h-[12px] bg-secondary rounded-full overflow-hidden relative">
              <div 
                class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
                style="width: %;"
              ></div>
            </div>
          </div>

          <div class="mt-[4%] xl:mt-[7%] flex text-[10px] md:text-[11px] xl:text-[13px] text-secondary w-[210px] md:w-[300px] h-[12px] md:h-[15px] xl:w-[400px] xl:h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
            <p class="font-roboto">
            <span class="text-white">Rank</span>
            <span class="text-secondary ml-2">2</span>
            </p>
            <p class="font-roboto">
            <span class="text-white">Score</span>
            <span class="text-secondary ml-2">700</span>
            </p>
          </div>
        <button id="play-btn" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out pt-[300px]">
          PlayNow
        </button>
      </div>
    </div>
    </div>
   `;
}

export function HomeEventListener() {
  setTimeout(() => {
    const btnPlay = document.getElementById("play-btn");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        console.log("play Button clicked");
        navigate("/LocalgameStyle");
      });
    }
  }, 100);
}

