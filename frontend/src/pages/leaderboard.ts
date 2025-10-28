export default function Leaderboard() {
  const topThree = [
    { rank: "1", name: "Smith", img: "../../public/blue-boy.svg", score: "6.359" },
    { rank: "2", name: "Kayla", img: "../../public/pink-girl.svg", score: "6.258" },
    { rank: "3", name: "John", img: "../../public/white-boy.svg", score: "6.158" }
  ];
  return `
  <div class="min-h-screen text-white font-roboto px-6 md:px-20 py-10 relative pb-[90px] overflow-y-auto">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <div data-path="/leaderboard" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
        <i class="fa-solid fa-trophy text-[18px] text-black"></i>
      </div>
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

    <h1 id="leader" class="text-4xl md:text-5xl font-glitch text-center mt-20 mb-14" >LEADERBOARD</h1>

    <div class="flex flex-col items-center justify-center relative">

      <!-- Top 3 Container -->
      <div class="flex flex-wrap justify-center items-end gap-10 md:gap-20">

        <!-- Silver -->
        <div class="flex flex-col items-center relative">
          <div class="w-[85px] h-[140px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
            <img src="${topThree[1].img}" alt="pink-girl"
              class="w-[60px] h-[60px] object-cover rounded-full border border-primary/50 absolute top-[5px]" />
            <div class="text-white text-[15px] font-roboto font-semibold">${topThree[1].name}</div>
            <div class="text-white text-[12px] font-roboto font-medium">${topThree[1].score}</div>
            <img src="../../public/silver.svg" alt="silver" class="w-[35px] h-[35px] absolute bottom-[-30px]" />
          </div>
          <div class="w-0 h-0 border-l-[43px] border-l-transparent border-r-[43px] border-r-transparent border-t-[43px] border-t-primary/40"></div>
        </div>

        <!-- Gold -->
        <div class="flex flex-col items-center relative">
          <div class="w-[90px] h-[160px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
            <img src="${topThree[0].img}" alt="blue-boy"
              class="w-[70px] h-[70px] object-cover rounded-full border border-primary/50 absolute top-[5px]" />
            <div class="text-white text-[15px] font-roboto font-semibold">${topThree[0].name}</div>
            <div class="text-white text-[12px] font-roboto font-medium">${topThree[0].score}</div>
            <img src="../../public/gold.svg" alt="gold" class="w-[40px] h-[40px] absolute bottom-[-30px]" />
          </div>
          <div class="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-t-[45px] border-t-primary/40"></div>
        </div>

        <!-- Bronze -->
        <div class="flex flex-col items-center relative">
          <div class="w-[85px] h-[140px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
            <img src="${topThree[2].img}" alt="white-boy"
              class="w-[60px] h-[60px] object-cover rounded-full border border-primary/50 absolute top-[5px]" />
            <div class="text-white text-[15px] font-roboto font-semibold">${topThree[2].name}</div>
            <div class="text-white text-[12px] font-roboto font-medium">${topThree[2].score}</div>
            <img src="../../public/bronze.svg" alt="bronze" class="w-[35px] h-[35px] absolute bottom-[-30px]" />
          </div>
          <div class="w-0 h-0 border-l-[43px] border-l-transparent border-r-[43px] border-r-transparent border-t-[43px] border-t-primary/40"></div>
        </div>

      </div>
    </div>

    <!-- Others -->
    <div class="relative left-1/2 -translate-x-1/2 top-[100px] w-[90%] pb-20 md:pb-0">
      <div class="flex flex-col gap-4 items-center">
        ${[
          {rank:"4.", name:"salaoui", img:"../../public/purple-girl.svg", score:"5.895"},
          {rank:"5.", name:"oliver", img:"../../public/white-boy2.svg", score:"5.150"},
          {rank:"6.", name:"Thomas", img:"../../public/red-boy.svg", score:"5.069"},
          {rank:"7.", name:"keltoum", img:"../../public/dark-girl.svg", score:"5.011"},
          {rank:"8.", name:"fateemaazaahrwwwwwwwwwwwwaae", img:"../../public/green-girl.svg", score:"4.993"},
        ]
          .map(
            (leader) => `
          <div class="w-[350px] md:w-[500px] h-[50px] bg-primary/40 rounded-lg flex items-center pl-5">
            <div class="flex items-center gap-3">
              <div class="text-white text-[22px] font-roboto font-medium">${leader.rank}</div>
              <img src="${leader.img}" alt="${leader.name}" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
              <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">${leader.name}</div>
            </div>
            <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
              <div class="text-white text-[20px] font-roboto font-medium">${leader.score}</div>
            </div>
          </div>

          `
          )
          .join("")}
      </div>
    </div>
  </div>

  `;
}