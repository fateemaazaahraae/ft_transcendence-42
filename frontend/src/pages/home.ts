
import { getSavedLang } from "../i18n/index.ts";
import { translateMsg } from "../i18n/translateBack";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";
import { loadUser } from "../utils/loadUser.ts";
import { getGameSocket } from "../utils/gameSocket.ts";
import { formatDate } from "../utils/date.ts";
import { showAlert } from "../utils/alert";


export default async function Home() {
  //GET AUTHENTICATION DATA
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
      console.log("login first");
      navigate("/login");
    }

    //GET GAME DATA

   let matches: any[] = [];
  let opponent: any[] = [];
  let userId: any;
  try {
    userId = localStorage.getItem("userId");

    const resGame = await fetch(`game/matches/user/${userId}`);
    if (!resGame.ok) throw new Error("Can't fetch matches");

    matches = await resGame.json();

    if (matches.length > 0) {
      opponent = await Promise.all(
        matches.map(async (match: any) => {
          const otherId =
            userId === match.player1Id
              ? match.player2Id
              : match.player1Id;

          const res = await fetch(`http://localhost:3000/users/${otherId}`);
          return await res.json();
        })
      );
    }
  } catch (err) {
    console.error(err);
  }

  //GET RANK
  let players: any[] = [];
  let myRank: any;
  try{
    const res = await fetch(`http://localhost:3003/leaderboard`);
    if (!res.ok)
      return "";
    players = await res.json();
    const myIndex = players.findIndex(
    (player) => player.id === userId
  );
   myRank = myIndex !== -1 ? myIndex + 1 : "0";
  }
  catch(err)
  {
    console.log(err);
    return "";
  }

  //GET ACHIEVEMENTS
  let trophies: any[] = [];
  try{
    const res = await fetch(`http://localhost:3004/achievements/${userId}`);
    if(!res.ok)
      throw new Error("can't fetch achievements");
    trophies = await res.json();
  }
  catch(err)
  {
    console.error(err);
  }

  const currentLang = (await getSavedLang()).toUpperCase();

  return `
<div class="relative w-full overflow-x-hidden px-6">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

         <div data-path="/home" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
          <i class="fa-solid fa-house text-[18px] text-black"></i>
        </div>
        <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
        <i data-path="/friends" class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
        <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
        <i data-path="/settings" class="fa-solid fa-gear text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out text-[18px]"></i>

    </aside>

    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 left-3"></i>
        <input type="text" placeholder="Search" class="search-input w-[180px] md:w-[280px] font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[2px] border-primary/70">
        <div class="search-results absolute top-full left-0 w-full h-auto backdrop-blur-md mt-1 hidden z-[9000] rounded-xl"></div>
      </div>
      <div class="arrow relative group">
        <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          ${currentLang}
        </button>
      </div>
      <div class="relative">
        <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
        <div id="notifBadge" class="absolute hidden top-1 inset-0 w-[7px] h-[7px] rounded-full bg-red-600"></div>
      </div>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

       <!-- HOME -->
  <div class ="relative flex lg:flex-row flex-col justify-center items-center lg:left-[7%] xl:left-0 mt-[30%] lg:mt-[20%] xl:mt-[10%]">
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
            <div class="fdata-i18n="player"lex text-white font-roboto justify-between text-[10px] md:text-[13px] w-[210px] md:w-[300px] xl:w-[400px]">
              <p data-i18n="level">Level</p>
              <p id="level" >7.5%</p>
            </div>

            <div class="w-[210px] h-[5px] md:w-[300px] md:h-[8px] xl:w-[400px] xl:h-[12px] bg-secondary rounded-full overflow-hidden relative">
              <div 
                id="levelPourcen" class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
                style="width: 0%;"
              ></div>
            </div>
          </div>

          <div class="mt-[4%] xl:mt-[7%] flex text-[10px] md:text-[11px] xl:text-[13px] text-secondary w-[210px] md:w-[300px] h-[12px] md:h-[15px] xl:w-[400px] xl:h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
            <p class="font-roboto">
            <span data-i18n="rank" class="text-white">Rank</span>
            <span class="text-secondary ml-2">${myRank}</span>
            </p>
            <p class="font-roboto">
            <span data-i18n="score" class="text-white">Score</span>
            <span id="xpoints" class="text-secondary ml-2">700</span>
            </p>
          </div>
      </div>
    </div>
     <!-- Vertical Bar -->
    <div class="w-[70%] h-[2px] md:w-[60%] lg:w-[1px] lg:h-[180px] xl:w-[3px] xl:h-[250px] rounded-full bg-[#35C6DD]  mt-[10%] md:mt-[8%] lg:mt-0 lg:ml-[40px] lg:mr-[30px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex relative gap-[10%] md:gap-[15%] lg:gap-0">
    <div class="flex flex-col mt-[4%] lg:mt-0 ml-[18%] md:ml-[10%] lg:ml-0 lg:gap-4 justify-center items-center">
      <h1 data-i18n="winRate" class=" text-white  lg:mb-0 font-glitch md:text-2xl xl:text-4xl whitespace-nowrap"> Wining rate </h1>
      <div class="relative w-[110px] h-[110px] mt-[15%] mb-[35%] lg:mt-0 lg:mb-0 xl:w-[150px] xl:h-[150px] rounded-full flex items-center justify-center">
        <div 
                id="winRateCircle"
                class="absolute inset-0 rounded-full"
                style="background: conic-gradient(#35C6DD 0%, #F40CA4 0);">
        </div>
        <div class="absolute inset-[8px] bg-black rounded-full flex items-center justify-center">
          <span id="winRatePercentage" class="text-white font-roboto lg:text-[16px] xl:text-xl">0%</span>
        </div>
      </div>



      <div class="relative flex flex-row bottom-[10%] md:bottom-[15%] lg:bottom-0 items-center gap-2">
        <!-- Wins -->
        <div class="relative group">
          <p data-i18n="wins" class="text-primary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Wins</p>
          <span id="Wins" class="absolute font-roboto left-1/2 -translate-x-1/2
                  text-primary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">0</span>
        </div>

        <p class="text-white text-xl">/</p>

        <!-- Losses -->
        <div class="relative group">
          <p data-i18n="losses" class="text-secondary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Losses</p>
          <span id="Losses" class="absolute font-roboto left-1/2 -translate-x-1/2 
                  text-secondary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">0</span>
        </div>
      </div>



    </div>
    <div class="h-[30%] w-[10px] lg:w-[1px] xl:w-[3px] xl:h-[250px] lg:h-[180px] rounded-full bg-[#35C6DD] mt-[2%] lg:mt-[14%] xl:mt-[1%] lg:mr-[20px] lg:ml-[40px] xl:ml-[80px] xl:mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
    <div class="flex flex-col justify-center items-center gap-2">
      <h1 data-i18n="achievements" class="text-white font-glitch md:text-2xl xl:text-4xl mt-[10%] md:mt-[5%] lg:mt-[20%] mr-[80%] lg:mr-[40%] xl:mr-0 xl:mt-0">Achievements</h1>

      <div class="relative group w-[340px] h-[220px] ">
  <!-- Main trophy -->
        <div  class="flex items-center justify-center absolute mt-[20%] md:mt-[23%] lg:mt-[20%] xl:mt-0 xl:top-1/2 left-[10%] lg:left-[30%] xl:left-1/2 w-[120px] h-[120px] md:w-[130px] md:h-[130px] xl:w-[190px] xl:h-[190px] rounded-full border-[3px] border-[#35C6DD] drop-shadow-cyan cursor-pointer 
                -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 group-hover:opacity-0" > 
          <img src="golden_trophy.svg" class=" w-[80px] md:w-[90px] xl:w-[120px]" />
        </div>
  <!-- Hidden trophies in 2x3 grid -->
        <div class="absolute top-[7%] lg:top-[10%] mr-50 lg:mr-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ">
          ${
  trophies.length === 0
    ? `
      <div class="flex flex-col items-center justify-center gap-5 lg:mr-[10%] w-[200px] md:w-[400px] h-full rounded-[30px]">
        <i class="fa-duotone fa-solid fa-trophy text-secondary drop-shadow-cyan text-[40px] md:text-[50px]"></i>
        <p data-i18n="noTrophies"
          class="font-regular font-roboto text-primary text-center text-[18px] md:text-xl">
          No trophies yet!<br/>Play now and become<br/>a champion!
        </p>
      </div>
    `
    : `
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-1 ml-0 lg:ml-5 xl:ml-10 ">
        ${trophies
          .map(
            (trophy: any) => `
              <img
                src="${trophy.img_src}"
                class="w-[60px] xl:w-[90px] h-[60px] xl:h-[90px]"
              />
            `
          )
          .join("")}
      </div>
      `
        }
        </div>
      </div>
    </div>
    </div>
  </div>
  <!-- Match history -->
    <div class="w-[70%] md:w-[60%] h-[2px] lg:w-0 lg:h-0 rounded-full bg-[#35C6DD]  lg:mt-0 ml-[15%] md:ml-[20%] lg:ml-0  shadow-[0_0_20px_#35C6DD]"></div>
  <div class = "flex flex-col lg:flex-row lg:gap-[8%] xl:gap-[8%] mt-[8%] md:mt-[3%] lg:mt-0 xl:mt-[2%] justify-center items-center">
    <div class="flex flex-col lg:ml-[10%] xl:ml-[10%]">
      <h1 data-i18n="matchHist" class=" text-center font-glitch md:text-2xl xl:text-4xl lg:mb-1 xl:mb-6">Match history</h1>
  
      <!-- Scrollable container -->
        <div class="flex flex-col items-center gap-4  w-[400px] h-[200px] xl:h-[250px] md:w-[600px] xl:w-[750px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
          ${matches.length === 0 ? 
          `<div class = "flex flex-col  items-center justify-center gap-5 border-2 border-primary/80 drop-shadow-cyan w-[300px] md:w-[400px]  h-full rounded-[30px]">
            <i class="fa-duotone fa-solid fa-table-tennis-paddle-ball text-secondary text-[40px] md:text-[50px]"></i>
            <p data-i18n="noMatches" class="font-regular font-roboto text-primary text-center text-[18px] md:text-xl"> No matches played yet </p> 
           </div>`
          : matches.map((match: any, index: number) =>{
            const opp = opponent[index];
          return `
            <div class="flex justify-between items-center py-[5px] h-[40px] lg:h-[50px] w-full xl:h-[60px] rounded-2xl bg-primary/60 px-4 shadow-lg">
              
              <!-- Player 1 -->
              <div class="flex items-center gap-3">
                <img src="${user.profileImage}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-[#35C6DD]" />
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${user.userName}</p>
              </div>
    
              <!-- Score -->
              <div class= "flex flex-col items-center font-normal text-[12px] text-white/60">
              <p class="flex items-center justify-center text-white font-roboto font-bold lg:text-[17px] xl:text-xl lg:gap-4 xl:gap-6">
              <span>${userId === match.player1Id ? match.score1 : match.score2}</span>
              <span>-</span>
              <span>${userId === match.player2Id ? match.score1 : match.score2}</span>
              </p>
              <span>${formatDate(match.timestamp)}</span> 
              </div>
              <!-- Player 2 -->
              <div class="flex items-center gap-3">
                <p class="text-white font-roboto font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-lg truncate w-[50px] lg:w-[80px]">${opp.userName}</p>
                <img src="${opp.profileImage}" class="object-cover w-[40px] h-[40px] xl:w-[45px] xl:h-[45px] rounded-full border-2 border-secondary" />
              </div>
            </div>
            `;}).join("")}
        </div>
    </div>  
    <div class="flex flex-col mt-[10%] md:mt-[5%]  lg:mt-[5%] lg:mr-[5%] xl:mr-[8%] mb-[20%] md:mb-[5%] lg:mb-0 xl:mt-[2%] items-center gap-5  ">
      <img src="match.svg" class="md:w-[350px] lg:w-[260px] xl:w-[350px]"/>
      <button data-i18n="play" id="play-btn2" class="w-[100px] xl:w-[160px] h-[30px] xl:h-[40px] rounded-3xl bg-primary/60 text-center text-white font-glitch hover:bg-secondary xl:text-2xl">play</button>
    </div>
  </div>
    </div>
   `;
}


export async function GetWinsLosses(userId: string)
{
    try {
    const res = await fetch(`http://localhost:3003/wlxp/${userId}`);
    if (res.status === 404) {
      return { Wins: 0, Losses: 0, XPoints: 0 };
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  }
  catch (err)
  {
    console.log(err);
    showAlert("Error while fetching data: " + err);
    return null;
  }
}

function CalculateWinRate(Wins: any, Losses: any) {
  const totalMatches = Wins + Losses;
  if (totalMatches === 0) return 0;
  const winningRate = (Wins * 100) / totalMatches;
  return winningRate;
}

function updateWinRateDisplay(wins: any, losses: any) {
    const winRate = CalculateWinRate(wins, losses);
    const roundedWinRate = Math.round(winRate);
    
    const circleElement = document.getElementById('winRateCircle');
    if (circleElement) {
        circleElement.style.background = `conic-gradient(#35C6DD ${winRate}%, #F40CA4 0)`;
    }
    
    const percentageElement = document.getElementById('winRatePercentage');
    if (percentageElement) {
        percentageElement.textContent = `${roundedWinRate}%`;
    }
}

export async function HomeEventListener()
{
  const btnPlay = document.getElementById("play-btn2");
  btnPlay?.addEventListener("click", () => {
    navigate("/remoteVSlocal");
  });
  const Wins = document.getElementById("Wins");
  const Losses = document.getElementById("Losses");
  const Level = document.getElementById("level");
  const Score = document.getElementById("xpoints");
  if (!Wins || !Losses || !Level || !Score) return;
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  const data = await GetWinsLosses(userId);
  if (!data) return;
  Wins.textContent = data.Wins;
  Losses.textContent = data.Losses;
  Score.textContent = data.XPoints;
  const levelRate = data.XPoints / 100;
  Level.textContent = `${levelRate}%`;
  updateWinRateDisplay(data.Wins, data.Losses);
  const lvl = document.getElementById("levelPourcen");
  let percentage = levelRate - Math.floor(levelRate);
  percentage = Math.round(percentage * 100) ; 
  if(lvl)
    lvl.style.width = `${percentage}%`;
}