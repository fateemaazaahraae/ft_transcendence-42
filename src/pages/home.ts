export default function Home(){
    const user ={
      name: "Keltoum",
      username: "koki",
      level: 70.8,
      rank: 2,
      score: 1.5 +"k",
      avatar: "/images/pink-girl.svg",

    };

    return`
    <div class="fixed bottom-[250px] left-6 flex flex-col items-center gap-10 z-50">
    <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary hover:bg-[#D934B0] rounded-full">
        <i class="fa-solid fa-house text-[22px] text-black cursor-pointer"></i>
    </div>
    <i class="fa-solid fa-user text-[22px] text-primary hover:text-[#D934B0] cursor-pointer"></i>
    <i class="fa-solid fa-trophy text-[18px] text-primary hover:text-[#D934B0] cursor-pointer"></i>
    <i class="fa-solid fa-user-group text-[22px] text-primary hover:text-[#D934B0] cursor-pointer"></i>
    <i class="fa-solid fa-comments text-[22px] text-primary hover:text-[#D934B0] cursor-pointer"></i>
    <i class="fa-solid fa-gear text-[22px] text-primary hover:text-[#D934B0] cursor-pointer"></i>
  </div>

  <div class="fixed left-[1650px] top-[40px] flex flex-row items-center gap-5 z-50">

    <!-- Language icon -->
    <div class="relative group">
      <button class="flex items-center gap-2 text-primary hover:text-[#D934B0] cursor-pointer">
        <i class="fa-solid fa-chevron-down text-xs cursor-pointer"></i>
        En
      </button>

      <ul class="absolute mt-1 rounded-md hidden group-hover:block transition-all duration-200 ease-in-out">
        <li class="px-4 py-2 hover:text-[#D934B0] cursor-pointer">En</li>
        <li class="px-4 py-2 hover:text-[#D934B0] cursor-pointer">Fr</li>
        <li class="px-4 py-2 hover:text-[#D934B0] cursor-pointer">Ar</li>
      </ul>
    </div>

    <i class="fa-regular fa-bell text-primary hover:text-[#D934B0] cursor-pointer"></i>
    <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-[#D934B0] cursor-pointer"></i>
    </div>

    <!-- HOME -->
   <div class="flex items-center absolute top-[200px] left-[10%] z-40">
  <!-- Avatar -->
  <img 
    src="/images/pink-girl.svg" 
    class="object-cover w-[200px] h-[200px] rounded-full border-[3px] border-[#35C6DD]"
  >

  <!-- Info Section -->
  <div class="flex flex-col ml-[60px] gap-[6px]">
    <h1 class="text-white font-glitch text-4xl">${user.name}</h1>
    <h1 class="text-white font-roboto text-xl">${user.username}</h1>

    <div class="flex text-white font-roboto justify-between text-[13px] w-[400px]">
      <p>Level</p>
      <p>${user.level}%</p>
    </div>

    <div class="w-[400px] h-[12px] bg-[#D934B0] rounded-full overflow-hidden relative">
      <div 
        class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
        style="width: ${user.level}%;"
      ></div>
    </div>

    <div class="mt-[3%] flex text-[13px] text-[#D934B0] w-[400px] h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
      <p>Rank ${user.rank}</p>
      <p>Score ${user.score}</p>
    </div>
  </div>

  <!-- Vertical Bar -->
  <div class="w-[3px] h-[250px] rounded-full bg-[#35C6DD] ml-[60px] shadow-[0_0_20px_#35C6DD]"></div>
  <h1 class="text-white font-glitch text-4xl ml-[5%]"> 
      Wining rate </h1>
</div>

    `;
}