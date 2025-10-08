export default function Home(){
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
    <div class=" flex absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[900px] h-[300px] rounded-[50px] bg-[rgba(53,198,221,0.6)]" >
        <h1 class="text-white font-glitch text-8xl mt-10 ml-20">
        Kayla
        </h1>
        <img src="/images/pink-girl.svg" class=" w-auto max-w-[600px] pr-5 ">
    </div>

    `;
}