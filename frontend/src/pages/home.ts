
import { getSavedLang } from "../i18n/index.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";
import { loadUser } from "../utils/loadUser.ts";
import { io } from "socket.io-client";
import { getGameSocket } from "../utils/gameSocket.ts";


export default async function Home() {
  let user:any;
  let game:any;
  try{
    //Auth data
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
    //Game data
    const userId = data.user.id;
    alert("the error is here");
    const resGame = await fetch(`http://localhost:3003/matches/user/${userId}`,{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const dataGame = await resGame.json();
    game = dataGame;
  }
  catch
  {
    console.log("login first");
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
        <!-- <button id="play-btn" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out pt-[300px]">
          PlayNow localy
        </button>
        <button id="remote-btn" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out pt-[100px]">
          PlayNow Remotely
        </button> -->
      </div>
    </div>
     <!-- Vertical Bar -->
    <div class="w-[70%] h-[2px] md:w-[60%] lg:w-[1px] lg:h-[180px] xl:w-[3px] xl:h-[250px] rounded-full bg-[#35C6DD] mt-[15%] lg:mt-0 lg:ml-[40px] lg:mr-[30px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex relative gap-[10%] md:gap-[15%] lg:gap-0">
    <div class="flex flex-col ml-[18%] md:ml-[10%] lg:ml-0 lg:gap-4 justify-center items-center">
      <h1 class=" text-white  lg:mb-0 font-glitch md:text-2xl xl:text-4xl whitespace-nowrap"> Wining rate </h1>
      <div class="relative w-[110px] h-[110px] mt-[15%] mb-[35%] lg:mt-0 lg:mb-0 xl:w-[150px] xl:h-[150px] rounded-full flex items-center justify-center">
        <div 
            class="absolute inset-0 rounded-full"
            style="background: conic-gradient(#35C6DD 10%, #F40CA4 0);">
        </div>
        <div class="absolute inset-[8px] bg-black rounded-full flex items-center justify-center">
          <span class="text-white font-roboto lg:text-[16px] xl:text-xl">10%</span>
        </div>
      </div>
      <div class="relative flex flex-row bottom-[10%] md:bottom-[15%] lg:bottom-0 items-center gap-2">
        <!-- Wins -->
        <div class="relative group">
          <p class="text-primary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Wins</p>
          <span class="absolute font-roboto left-1/2 -translate-x-1/2
                  text-primary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">4</span>
        </div>

        <p class="text-white text-xl">/</p>

        <!-- Losses -->
        <div class="relative group">
          <p class="text-secondary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Losses</p>
          <span class="absolute font-roboto left-1/2 -translate-x-1/2 
                  text-secondary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">6</span>
        </div>
      </div>
    </div>
    <div class="h-[30%] w-[10px] lg:w-[1px] xl:w-[3px] xl:h-[250px] lg:h-[180px] rounded-full bg-[#35C6DD] mt-[2%] lg:mt-[14%] xl:mt-[1%] lg:mr-[20px] lg:ml-[40px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex flex-col justify-center items-center gap-2">
      <h1 class="text-white font-glitch md:text-2xl xl:text-4xl mt-[10%] md:mt-[5%] lg:mt-[20%] mr-[80%] lg:mr-[40%] xl:mr-0 xl:mt-0">Achievements</h1>

      <div class="relative group w-[340px] h-[220px] ">
        <!-- Main trophy -->
        <div  class="flex items-center justify-center absolute mt-[20%] md:mt-[23%] lg:mt-[20%] xl:mt-0 xl:top-1/2 left-[10%] lg:left-[30%] xl:left-1/2 w-[120px] h-[120px] md:w-[130px] md:h-[130px] xl:w-[190px] xl:h-[190px] rounded-full border-[3px] border-[#35C6DD] drop-shadow-cyan cursor-pointer 
                -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 group-hover:opacity-0" > 
          <img src="/public/golden_trophy.svg" class=" w-[80px] md:w-[90px] xl:w-[120px]" />
        </div>
        <!-- Hidden trophies in 2x3 grid -->
        <div class="absolute top-[30%] lg:top-[30%] xl:top-[50%] left-[10%] lg:left-[30%] xl:left-[37%] flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2">
          <div class="flex gap-2 mb-1">
            <img src="/public/trophy1.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy6.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy3.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
          </div>
          <div class="flex gap-2 mt-1">
            <img src="/public/trophy4.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy5.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy2.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  <!-- Match history -->
    <div class="w-[70%] md:w-[60%] h-[2px] lg:w-0 lg:h-0 rounded-full bg-[#35C6DD] mt-[30%] md:mt-[18%] lg:mt-0 ml-[15%] md:ml-[20%] lg:ml-0  shadow-[0_0_20px_#35C6DD]"></div>
  <div class = "flex flex-col lg:flex-row lg:gap-[5%] mt-[8%] md:mt-[3%] lg:mt-[15%] xl:mt-[12%] justify-center items-center">
    <div class="flex flex-col lg:ml-[20%]">
      <h1 class=" text-center font-glitch md:text-2xl xl:text-4xl lg:mb-1 xl:mb-6">Match history</h1>
  
      <!-- Scrollable container -->
        <div class="flex flex-col gap-4 w-[400px] h-[200px] md:w-[600px] xl:w-[750px] max-h-[250px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
            
            <div class="flex justify-between items-center h-[40px] lg:h-[50px] w-full xl:h-[60px] rounded-2xl bg-primary/60 px-4 shadow-lg">
              ${game.map(match => `
              <!-- Player 1 -->
              <div class="flex items-center gap-3">
                <img src="${user.profileImage}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-[#35C6DD]" />
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${match.player1.name}</p>
              </div>
    
              <!-- Score -->
              <p class="flex items-center justify-center text-white font-roboto font-bold lg:text-[17px] xl:text-xl lg:gap-4 xl:gap-6">
                <span>${game.score1}</span>
                <span>-</span>
                <span>${game.score2}</span>
              </p>
              <!-- Player 2 -->
              <div class="flex items-center gap-3">
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${match.player2.name}</p>
                <img src="${match.player2.avatar}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-secondary" />
              </div>
    
            </div>
            `).join("")}
        </div>
    </div>  
    <div class="flex flex-col mt-[10%] md:mt-[5%] mb-[15%] md:mb-[5%] lg:md-0 lg:mt-[5%] lg:mr-[10%] items-center gap-5 group">
      <img src="/public/match.svg" class="md:w-[350px] lg:w-[250px]"/>
      <button id="play-btn2" class="w-[100px] xl:w-[130px] h-[30px] rounded-3xl bg-primary/60 text-white font-glitch hover:bg-secondary">play</button>
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

    const btnRemote = document.getElementById("remote-btn");
    if (btnRemote) {
      btnRemote.addEventListener("click", () => {
        console.log("Remote Play Clicked - Attempting Connection...");

        const token = localStorage.getItem("token"); // this will get JWT prolly
        if (!token) {
          navigate("/login"); 
          return;
        }

        const socket = getGameSocket(token); /// here is the key to send request to our game server

        if (!socket.hasListeners("match_found")) {
            
            socket.on("connect", () => {
                console.log("✅ Connected via Manager! ID:", socket.id);
                navigate("/RemotegameStyle");
                socket.emit('join_queue');
            });

            socket.on("match_found", (data) => {
                console.log("🎉 MATCH FOUND! Navigating to game...");
                localStorage.setItem("currentMatch", JSON.stringify(data));
                navigate("/remote-game"); 
            });

            socket.on("waiting_for_match", (data) => {
                console.log(`Status: ${data.message}`);
            });
        }

        if (socket.connected) {
             socket.emit('join_queue');
        }
      });
    }
  }, 100);
}
/*import { navigate } from "../main.ts";
export default function Home() {
  const user = {
    name: "Keltoum",
    username: "koki",
    level: 70.8,
    rank: 2,
    score: 1.5 + "k",
    avatar: "/public/pink-girl.svg",
    wins: 45,
    losses: 14,
    get winning() {
      const total = this.wins + this.losses;
      return total === 0 ? 0 : ((this.wins / total) * 100).toFixed(1);
    },
      matchHistory: [
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "John",
        avatar: "/public/white-boy2.svg",
        score: 7,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 9,
      },
      player2: {
        name: "tima",
        avatar: "/public/green-girl.svg",
        score: 11,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "Salma",
        avatar: "/public/purple-girl.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/public/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/public/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/public/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/public/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/public/blue-boy.svg",
        score: 5,
      },
    },
    // Add more matches as needed
  ],
  };
  const winningRate =user.winning;
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
      <div class="arrow relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
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
        src="/public/pink-girl.svg" 
        class="object-cover w-[110px] h-[110px] md:w-[150px] md:h-[150px] xl:w-[220px] xl:h-[220px] rounded-full border-[3px] border-[#35C6DD]"
      >

      <!-- Info Section -->
      <div class="flex flex-col ml-[5%] md:ml-[3%] xl:ml-[60px] lg:gap-[8%] xl:gap-[10px]">
          <h1 class="text-white font-glitch text-xl md:text-2xl xl:text-4xl">${user.name}</h1>
          <h1 class="text-white font-roboto text-[14px] md:text-[16px] xl:text-xl">${user.username}</h1>
          <div class="lg:gap-3 xl:gap-6 lg:mt-[5%] xl:mt-[10%]">
            <div class="flex text-white font-roboto justify-between text-[10px] md:text-[13px] w-[210px] md:w-[300px] xl:w-[400px]">
              <p>Level</p>
              <p>${user.level}%</p>
            </div>

            <div class="w-[210px] h-[5px] md:w-[300px] md:h-[8px] xl:w-[400px] xl:h-[12px] bg-secondary rounded-full overflow-hidden relative">
              <div 
                class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
                style="width: ${user.level}%;"
              ></div>
            </div>
          </div>

          <div class="mt-[4%] xl:mt-[7%] flex text-[10px] md:text-[11px] xl:text-[13px] text-secondary w-[210px] md:w-[300px] h-[12px] md:h-[15px] xl:w-[400px] xl:h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
            <p class="font-roboto">
            <span class="text-white">Rank</span>
            <span class="text-secondary ml-2">${user.rank}</span>
            </p>
            <p class="font-roboto">
            <span class="text-white">Score</span>
            <span class="text-secondary ml-2">${user.score}</span>
            </p>
          </div>
      </div>
    </div>
    <!-- Vertical Bar -->
    <div class="w-[70%] h-[2px] md:w-[60%] lg:w-[1px] lg:h-[180px] xl:w-[3px] xl:h-[250px] rounded-full bg-[#35C6DD] mt-[15%] lg:mt-0 lg:ml-[40px] lg:mr-[30px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex relative gap-[10%] md:gap-[15%] lg:gap-0">
    <div class="flex flex-col ml-[18%] md:ml-[10%] lg:ml-0 lg:gap-4 justify-center items-center">
      <h1 class=" text-white  lg:mb-0 font-glitch md:text-2xl xl:text-4xl whitespace-nowrap"> Wining rate </h1>
      <div class="relative w-[110px] h-[110px] mt-[15%] mb-[35%] lg:mt-0 lg:mb-0 xl:w-[150px] xl:h-[150px] rounded-full flex items-center justify-center">
        <div 
            class="absolute inset-0 rounded-full"
            style="background: conic-gradient(#35C6DD ${winningRate}%, #F40CA4 0);">
        </div>
        <div class="absolute inset-[8px] bg-black rounded-full flex items-center justify-center">
          <span class="text-white font-roboto lg:text-[16px] xl:text-xl">${winningRate}%</span>
        </div>
      </div>
      <div class="relative flex flex-row bottom-[10%] md:bottom-[15%] lg:bottom-0 items-center gap-2">
        <!-- Wins -->
        <div class="relative group">
          <p class="text-primary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Wins</p>
          <span class="absolute font-roboto left-1/2 -translate-x-1/2
                  text-primary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ${user.wins}
          </span>
        </div>

        <p class="text-white text-xl">/</p>

        <!-- Losses -->
        <div class="relative group">
          <p class="text-secondary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Losses</p>
          <span class="absolute font-roboto left-1/2 -translate-x-1/2 
                  text-secondary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ${user.losses}
            </span>
        </div>
      </div>
    </div>
    <div class="h-[30%] w-[10px] lg:w-[1px] xl:w-[3px] xl:h-[250px] lg:h-[180px] rounded-full bg-[#35C6DD] mt-[2%] lg:mt-[14%] xl:mt-[1%] lg:mr-[20px] lg:ml-[40px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex flex-col justify-center items-center gap-2">
      <h1 class="text-white font-glitch md:text-2xl xl:text-4xl mt-[10%] md:mt-[5%] lg:mt-[20%] mr-[80%] lg:mr-[40%] xl:mr-0 xl:mt-0">Achievements</h1>

      <div class="relative group w-[340px] h-[220px] ">
        <!-- Main trophy -->
        <div  class="flex items-center justify-center absolute mt-[20%] md:mt-[23%] lg:mt-[20%] xl:mt-0 xl:top-1/2 left-[10%] lg:left-[30%] xl:left-1/2 w-[120px] h-[120px] md:w-[130px] md:h-[130px] xl:w-[190px] xl:h-[190px] rounded-full border-[3px] border-[#35C6DD] drop-shadow-cyan cursor-pointer 
                -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 group-hover:opacity-0" > 
          <img src="/public/golden_trophy.svg" class=" w-[80px] md:w-[90px] xl:w-[120px]" />
        </div>
        <!-- Hidden trophies in 2x3 grid -->
        <div class="absolute top-[30%] lg:top-[30%] xl:top-[50%] left-[10%] lg:left-[30%] xl:left-[37%] flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2">
          <div class="flex gap-2 mb-1">
            <img src="/public/trophy1.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy6.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy3.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
          </div>
          <div class="flex gap-2 mt-1">
            <img src="/public/trophy4.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy5.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
            <img src="/public/trophy2.svg" class="w-[60px] xl:w-[100px] h-[60px] xl:h-[100px]" />
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  <!-- Match history -->
    <div class="w-[70%] md:w-[60%] h-[2px] lg:w-0 lg:h-0 rounded-full bg-[#35C6DD] mt-[30%] md:mt-[18%] lg:mt-0 ml-[15%] md:ml-[20%] lg:ml-0  shadow-[0_0_20px_#35C6DD]"></div>
  <div class = "flex flex-col lg:flex-row lg:gap-[5%] mt-[8%] md:mt-[3%] lg:mt-[15%] xl:mt-[12%] justify-center items-center">
    <div class="flex flex-col lg:ml-[20%]">
      <h1 class=" text-center font-glitch md:text-2xl xl:text-4xl lg:mb-1 xl:mb-6">Match history</h1>
  
      <!-- Scrollable container -->
        <div class="flex flex-col gap-4 w-[400px] h-[200px] md:w-[600px] xl:w-[750px] max-h-[250px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
            ${user.matchHistory.map(match => `
            <div class="flex justify-between items-center h-[40px] lg:h-[50px] w-full xl:h-[60px] rounded-2xl bg-primary/60 px-4 shadow-lg">
    
              <!-- Player 1 -->
              <div class="flex items-center gap-3">
                <img src="${match.player1.avatar}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-[#35C6DD]" />
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${match.player1.name}</p>
              </div>
    
              <!-- Score -->
              <p class="flex items-center justify-center text-white font-roboto font-bold lg:text-[17px] xl:text-xl lg:gap-4 xl:gap-6">
                <span>${match.player1.score}</span>
                <span>-</span>
                <span>${match.player2.score}</span>
              </p>
              <!-- Player 2 -->
              <div class="flex items-center gap-3">
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${match.player2.name}</p>
                <img src="${match.player2.avatar}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-secondary" />
              </div>
    
            </div>
            `).join("")}
        </div>
    </div>  
    <div class="flex flex-col mt-[10%] md:mt-[5%] mb-[15%] md:mb-[5%] lg:md-0 lg:mt-[5%] lg:mr-[10%] items-center gap-5 group">
      <img src="/public/match.svg" class="md:w-[350px] lg:w-[250px]"/>
      <button id="play-btn2" class="w-[100px] xl:w-[130px] h-[30px] rounded-3xl bg-primary/60 text-white font-glitch hover:bg-secondary">play</button>
    </div>
  </div>
    
</div>
    `;
}

export function HomeEventListener()
{
  const btnPlay = document.getElementById("play-btn2");
  btnPlay?.addEventListener("click", () => {navigate("/gameStyle");
});
}*/