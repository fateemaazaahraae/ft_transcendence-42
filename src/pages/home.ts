export default function Home() {
  const user = {
    name: "Keltoum",
    username: "koki",
    level: 70.8,
    rank: 2,
    score: 1.5 + "k",
    avatar: "/images/pink-girl.svg",
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
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "John",
        avatar: "/images/white-boy2.svg",
        score: 7,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 9,
      },
      player2: {
        name: "tima",
        avatar: "/images/green-girl.svg",
        score: 11,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "Salma",
        avatar: "/images/purple-girl.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/images/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/images/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/images/blue-boy.svg",
        score: 5,
      },
    },
    {
      player1: {
        name: "Keltoum",
        avatar: "/images/pink-girl.svg",
        score: 11,
      },
      player2: {
        name: "hmed",
        avatar: "/images/blue-boy.svg",
        score: 5,
      },
    },
    // Add more matches as needed
  ],
  };
  const winningRate =user.winning;
  return `
   <div class="relative w-full h-screen">

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
      <div class="relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
        <ul class="absolute mt-1 rounded-md hidden group-hover:block bg-black/80 p-2">
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">En</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">Fr</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">Ar</li>
        </ul>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- HOME -->
  <div class ="relative flex flex-col">
   <div class="flex justify center items-center absolute top-[200px] left-[10%] z-40">
  <!-- Avatar -->
  <img 
    src="/images/pink-girl.svg" 
    class="object-cover w-[220px] h-[220px] rounded-full border-[3px] border-[#35C6DD]"
  >

  <!-- Info Section -->
  <div class="flex flex-col  ml-[60px] gap-[10px]">
    <h1 class="text-white font-glitch text-4xl">${user.name}</h1>
    <h1 class="text-white font-roboto text-xl">${user.username}</h1>
    <div class="gap-6 mt-[10%]">
    <div class="flex text-white font-roboto justify-between text-[13px] w-[400px]">
      <p>Level</p>
      <p>${user.level}%</p>
    </div>

    <div class="w-[400px] h-[12px] bg-secondary rounded-full overflow-hidden relative">
      <div 
        class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
        style="width: ${user.level}%;"
      ></div>
    </div>
    </div>

    <div class="mt-[7%] flex text-[13px] text-secondary w-[400px] h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
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

  <!-- Vertical Bar -->
  <div class="w-[3px] h-[250px] rounded-full bg-[#35C6DD] ml-[80px] mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
  <div class="flex flex-col ml-[50px] gap-4 justify-center items-center">
  <h1 class=" text-white font-glitch text-4xl whitespace-nowrap"> Wining rate </h1>
  <div class="relative w-[150px] h-[150px] rounded-full flex items-center justify-center">
  <div 
    class="absolute inset-0 rounded-full"
    style="background: conic-gradient(#35C6DD ${winningRate}%, #F40CA4 0);">
  </div>
  <div class="absolute inset-[8px] bg-black rounded-full flex items-center justify-center">
    <span class="text-white font-roboto text-xl">${winningRate}%</span>
  </div>
  </div>
<div class="relative flex flex-row items-center gap-2">
  <!-- Wins -->
  <div class="relative group">
    <p class="text-primary font-roboto text-xl cursor-pointer group-hover:blur-[3px]">Wins</p>
    <span class="absolute font-roboto left-1/2 -translate-x-1/2
                  text-primary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      ${user.wins}
    </span>
  </div>

  <p class="text-white text-xl">/</p>

  <!-- Losses -->
  <div class="relative group">
    <p class="text-secondary font-roboto text-xl cursor-pointer group-hover:blur-[3px]">Losses</p>
    <span class="absolute font-roboto left-1/2 -translate-x-1/2 
                  text-secondary text-sm px-3 py-1 rounded-md 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      ${user.losses}
    </span>
  </div>
</div>

</div>
<div class="w-[3px] h-[250px] rounded-full bg-[#35C6DD] ml-[80px] mr-[40px] shadow-[0_0_20px_#35C6DD]"></div>
<div class="flex flex-col items-center gap-2">
  <h1 class="text-white font-glitch text-4xl">Achievements</h1>

  <div class="relative group w-[340px] h-[220px] ">
    <!-- Main trophy -->
    <div  class="flex items-center justify-center absolute top-1/2 left-1/2 w-[190px] h-[190px] rounded-full border-[3px] border-[#35C6DD] drop-shadow-cyan cursor-pointer 
                -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 group-hover:opacity-0" > 
    <img src="/images/golden_trophy.svg" />
    </div>
    <!-- Hidden trophies in 2x3 grid -->
    <div class="absolute top-1/2 left-[37%] flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2">
      <div class="flex gap-2 mb-1">
        <img src="/images/trophy1.svg" class="w-[100px] h-[100px]" />
        <img src="/images/trophy6.svg" class="w-[100px] h-[100px]" />
        <img src="/images/trophy3.svg" class="w-[100px] h-[100px]" />
      </div>
      <div class="flex gap-2 mt-1">
        <img src="/images/trophy4.svg" class="w-[100px] h-[100px]" />
        <img src="/images/trophy5.svg" class="w-[100px] h-[100px]" />
        <img src="/images/trophy2.svg" class="w-[100px] h-[100px]" />
      </div>
    </div>
  </div>
</div>
</div>

<!-- Match history -->
<div class="mt-[550px] flex flex-col ml-[20%]">
  <h1 class="text-white font-glitch text-4xl ml-[12%] mb-6">Match history</h1>
  
  <!-- Scrollable container -->
  <div class = "flex gap-[15%]">
  <div class="flex flex-col gap-4 w-[750px] max-h-[250px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
  ${user.matchHistory.map(match => `
    <div class="flex justify-between items-center w-full h-[60px] rounded-2xl bg-primary/60 px-4 shadow-lg">
    
    <!-- Player 1 -->
    <div class="flex items-center gap-3">
    <img src="${match.player1.avatar}" class="object-cover w-[45px] h-[45px] rounded-full border-2 border-[#35C6DD]" />
    <p class="text-white font-roboto text-lg">${match.player1.name}</p>
    </div>
    
    <!-- Score -->
    <p class="flex items-center justify-center text-white font-roboto text-xl gap-6">
      <span>${match.player1.score}</span>
      <span>-</span>
      <span>${match.player2.score}</span>
    </p>
    <!-- Player 2 -->
    <div class="flex items-center gap-3">
    <p class="text-white font-roboto text-lg">${match.player2.name}</p>
    <img src="${match.player2.avatar}" class="object-cover w-[45px] h-[45px] rounded-full border-2 border-secondary" />
    </div>
    
    </div>
    `).join("")}
    </div>
    <div class="flex flex-col items-center gap-5 group">
      <img src="/images/match.svg" class ="w-[300px]"/>
      <button class=" w-[130px] h-[30px] rounded-3xl bg-primary/60 text-white font-glitch hover:bg-secondary">play</button>
    </div>
    </div>
    </div>
</div>
</div>
    `;
}