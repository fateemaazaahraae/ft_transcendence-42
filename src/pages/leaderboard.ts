export default function Leaderboard() {
  return `
  <div class="min-h-screen text-white font-roboto px-6 md:px-20 py-10 relative pb-[90px] overflow-y-auto">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <i class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
        <i class="fa-solid fa-gear text-black text-[18px]"></i>
      </div>
    </aside>


    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-5">
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

    <h1 id="leader" class="text-4xl md:text-5xl font-glitch text-center mt-20 mb-14" >LEADERBOARD</h1>

    <!-- Gold -->
    <div class="flex flex-col gap-20 top-[220px] items-center">
      <div class="w-[90px] h-[150px] bg-primary/40 ">
        <img src="../../images/blue-boy.svg" alt="blue-boy" class="w-[70px] h-[70px] object-cover fixed left-1/2 -translate-x-1/2 top-[10px] rounded-full border border-primary/50" />
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[88px] text-[15px] font-roboto font-semibold"> Smith</div>
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[110px] text-[12px] font-roboto font-semibold"> 6.359</div>
        <img src="../../images/gold.svg" alt="gold" class="w-[40px] h-[40px] fixed left-1/2 -translate-x-1/2 top-[137px] z-10" />
      </div>
      <div class="fixed left-1/2 -translate-x-1/2 top-[370px]
                w-0 h-0
                border-l-[45px] border-l-transparent
                border-r-[45px] border-r-transparent
                border-t-[45px] border-t-primary/40 z-0">
      </div>

      <!-- Silver -->
      <div class="w-[85px] h-[130px] bg-primary/40">
        <img src="../../images/pink-girl.svg" alt="blue-boy" class="w-[60px] h-[60px] object-cover fixed left-1/2 -translate-x-1/2 top-[10px] rounded-full border border-primary/50" />
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[75px] text-[15px] font-roboto font-semibold"> Kayla</div>
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[98px] text-[12px] font-roboto font-semibold"> 6.258</div>
        <img src="../../images/silver.svg" alt="gold" class="w-[35px] h-[35px] fixed left-1/2 -translate-x-1/2 top-[120px] z-10" />
      </div>
      <div class="fixed left-[1170px] -translate-x-1/2 top-[380px]
                w-0 h-0
                border-l-[43px] border-l-transparent
                border-r-[43px] border-r-transparent
                border-t-[43px] border-t-primary/40"></div>
      
      
      <!-- Bronze -->
      <div class="w-[85px] h-[130px] bg-primary/40">
        <img src="../../images/white-boy.svg" alt="blue-boy" class="w-[60px] h-[60px] object-cover fixed left-1/2 -translate-x-1/2 top-[10px] rounded-full border border-primary/50" />
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[75px] text-[15px] font-roboto font-semibold"> Noah</div>
        <div class="fixed left-1/2 -translate-x-1/2 text-white top-[98px] text-[12px] font-roboto font-semibold"> 5.996</div>
        <img src="../../images/bronze.svg" alt="gold" class="w-[35px] h-[35px] fixed left-1/2 -translate-x-1/2 top-[120px] z-10" />
      </div>
      <div class="fixed left-[750px] -translate-x-1/2 top-[380px]
                w-0 h-0
                border-l-[43px] border-l-transparent
                border-r-[43px] border-r-transparent
                border-t-[43px] border-t-primary/40"></div>
    </div>


    <!-- Others -->
    <div class="relative left-1/2 -translate-x-1/2 top-[300px] w-[90%] pb-20 md:pb-0">
      <div class="flex flex-col gap-4 items-center">
        ${[
          {rank:"4.", name:"salaoui", img:"../../images/purple-girl.svg", score:"5.895"},
          {rank:"5.", name:"oliver", img:"../../images/white-boy2.svg", score:"5.150"},
          {rank:"6.", name:"Thomas", img:"../../images/red-boy.svg", score:"5.069"},
          {rank:"7.", name:"keltoum", img:"../../images/dark-girl.svg", score:"5.011"},
          {rank:"8.", name:"fateemaazaahrwwwwwwwwwwwwaae", img:"../../images/green-girl.svg", score:"4.993"},
        ]
          .map(
            (leader) => `
          <div class="w-[350px] md:w-[500px] h-[50px] bg-primary/40 rounded-lg flex items-center pl-5">
            <div class="flex items-center gap-3">
              <div class="text-white text-[22px] font-roboto font-semibold">${leader.rank}</div>
              <img src="${leader.img}" alt="${leader.name}" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
              <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">${leader.name}</div>
            </div>
            <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
              <div class="text-white text-[20px] font-roboto font-semibold">${leader.score}</div>
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