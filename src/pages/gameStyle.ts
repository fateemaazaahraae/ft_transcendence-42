export default function GameStyle() {
    const match ={
        user: "/images/pink-girl.svg",
        player: "/images/purple-girl.svg",
    };
  return `
  <div class="relative w-full h-screen">

    <!-- Sidebar -->
<aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

       <div class="md:w-[40px] md:h-[40px] sm:w-[35px] sm:h-[35px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
      <i class="fa-solid fa-house text-black text-[18px] "></i>
      </div>
      <i class="fa-solid fa-trophy text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

        <i class="fa-solid fa-user-group text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <i class="fa-solid fa-comments text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-gear text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
    </aside>


    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-6">
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

    <!-- chose your mode -->

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <h1 class="font-glitch text-6xl text-black leading-[1.9]"
       style="-webkit-text-stroke: 2px rgba(53,198,221,0.6);">Ready to play?</h1>
      <h1 class="font-glitch text-7xl text-primary/60 text-shadow-cyan">Pick your mode</h1>
      <div class="flex gap-20 mt-[12%]">
        <div class=" w-[600px] h-[430px] bg-primary/60 rounded-3xl ">
            <h1 class="mt-[5%] font-glitch text-center text-4xl"> One-on-One</h1>
            <div class="flex justify-center gap-3">
                <img src="${match.user}" 
                class=" object-cover w-[150px] h-[150px] rounded-full border-[3px] border-[#35C6DD]/90"/>
                <img src="/images/vs.svg" class="w-[120px]" />
                <i class="object-cover fa-solid fa-circle-user text-[150px] mt-[25%] text-primary/90"></i> 
            </div>
            <button class="ml-[40%] w-[120px] h-[30px] font-roboto bg-secondary rounded-full">Play</button>
        </div>
        <div class=" w-[600px] h-[430px] bg-primary/60 rounded-3xl">
            <h1 class="mt-[5%] font-glitch text-center text-4xl"> Tournament</h1>
            <div class="flex justify-center mt-[12%]">
                <img src="/images/boys-team.svg"/>
                <img src="/images/golden_trophy.svg"/>
                <img src="/images/girls-team.svg" />
            </div>
            <button class="mt-[10%] ml-[40%] w-[120px] h-[30px] font-roboto bg-secondary rounded-full">Start</button>
        </div>
      </div>
    </div>

  </div>
  `;
}
