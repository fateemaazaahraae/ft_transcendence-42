export default function Leaderboard() {
  return `
  <div class="fixed bottom-[250px] left-6 flex flex-col items-center gap-10 z-50">
    <i class="fa-solid fa-house hover:text-secondary transition-colors duration-400 ease-in-out text-[22px] text-primary cursor-pointer"></i>
    <i class="fa-solid fa-user hover:text-secondary transition-colors duration-400 ease-in-out text-[22px] text-primary cursor-pointer"></i>

    <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary rounded-full">
      <i class="fa-solid fa-trophy text-[18px] text-black cursor-pointer"></i>
    </div>

    <i class="fa-solid fa-user-group hover:text-secondary transition-colors duration-400 ease-in-out text-[22px] text-primary cursor-pointer"></i>
    <i class="fa-solid fa-comments hover:text-secondary transition-colors duration-400 ease-in-out text-[22px] text-primary cursor-pointer"></i>
    <i class="fa-solid fa-gear hover:text-secondary transition-colors duration-400 ease-in-out text-[22px] text-primary cursor-pointer"></i>
  </div>

   <div class="fixed left-[1650px] top-[40px] flex flex-row items-center gap-5 z-50">

    <!-- Language icon -->
    <div class="relative group">
      <button class="flex items-center gap-2 text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">
        <i class="fa-solid fa-chevron-down text-xs cursor-pointer"></i>
        En
      </button>

      <ul class="absolute mt-1 rounded-md hidden group-hover:block transition-all duration-400 ease-in-out">
        <li class="px-4 py-2 hover:text-secondary cursor-pointer">En</li>
        <li class="px-4 py-2 hover:text-secondary cursor-pointer">Fr</li>
        <li class="px-4 py-2 hover:text-secondary cursor-pointer">Ar</li>
      </ul>
    </div>

    <i class="fa-regular fa-bell text-primary cursor-pointer hover:text-secondary transition-colors duration-400 ease-in-out"></i>
    <i class="fa-solid fa-arrow-right-from-bracket text-primary cursor-pointer hover:text-secondary transition-colors duration-400 ease-in-out"></i>
  </div>

  <h1 id="leader" class="text-white font-glitch text-5xl tracking-[4px] fixed top-[120px] left-1/2 -translate-x-1/2 z-50" >LEADERBOARD</h1>

  <!-- Gold -->
  <div class="w-[90px] h-[150px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[220px]">
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
  <div class="w-[85px] h-[130px] bg-primary/40 fixed left-[1170px] -translate-x-1/2 top-[250px]">
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
  <div class="w-[85px] h-[130px] bg-primary/40 fixed left-[750px] -translate-x-1/2 top-[250px]">
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


  <!-- Others -->
  <!-- First row -->
  <div class="w-[500px] h-[50px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[500px] rounded-lg flex items-center">
    <!-- Left side: rank, avatar, name -->
    <div class="flex items-center gap-3">
      <div class="text-white text-[22px] font-roboto font-semibold ml-7">4.</div>
      <img src="../../images/purple-girl.svg" alt="purple-girl" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
      <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">salaoui</div>
    </div>
    <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
      <div class="text-white text-[20px] font-roboto font-semibold">5.895</div>
    </div>
  </div>
  
  <!-- Second row -->
  <div class="w-[500px] h-[50px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[580px] rounded-lg flex items-center">
    <!-- Left side: rank, avatar, name -->
    <div class="flex items-center gap-3">
      <div class="text-white text-[22px] font-roboto font-semibold ml-7">5.</div>
      <img src="../../images/white-boy2.svg" alt="white-boy2" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
      <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">oliver</div>
    </div>
    <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
      <div class="text-white text-[20px] font-roboto font-semibold">5.150</div>
    </div>
  </div>

  <!-- Third row -->
  <div class="w-[500px] h-[50px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[660px] rounded-lg flex items-center">
    <!-- Left side: rank, avatar, name -->
    <div class="flex items-center gap-3">
      <div class="text-white text-[22px] font-roboto font-semibold ml-7">6.</div>
      <img src="../../images/red-boy.svg" alt="red-boy" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
      <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">Thomas</div>
    </div>
    <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
      <div class="text-white text-[20px] font-roboto font-semibold">5.069</div>
    </div>
  </div>

  <!-- Fourth row -->
   <div class="w-[500px] h-[50px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[740px] rounded-lg flex items-center">
    <!-- Left side: rank, avatar, name -->
    <div class="flex items-center gap-3">
      <div class="text-white text-[22px] font-roboto font-semibold ml-7">7.</div>
      <img src="../../images/dark-girl.svg" alt="dark-girl" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
      <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">keltoum</div>
    </div>
    <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
      <div class="text-white text-[20px] font-roboto font-semibold">5.011</div>
    </div>
  </div>

  <!-- Fifth row -->
  <div class="w-[500px] h-[50px] bg-primary/40 fixed left-1/2 -translate-x-1/2 top-[820px] rounded-lg flex items-center">
    <!-- Left side: rank, avatar, name -->
    <div class="flex items-center gap-3">
      <div class="text-white text-[22px] font-roboto font-semibold ml-7">8.</div>
      <img src="../../images/green-girl.svg" alt="green-girl" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
      <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">fateemaazaahrwwwwwwwwwwwwaae</div>
    </div>
    <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
      <div class="text-white text-[20px] font-roboto font-semibold">4.993</div>
    </div>
  </div>

  `;
}