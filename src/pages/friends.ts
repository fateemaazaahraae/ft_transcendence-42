export default function Friends() {
    return `
  <div class="fixed bottom-[250px] left-6 flex flex-col items-center gap-10 z-50">
      <i class="fa-solid fa-house text-[22px] hover:text-secondary text-primary cursor-pointer"></i>
      <i class="fa-solid fa-user text-[22px] hover:text-secondary text-primary cursor-pointer"></i>
      <i class="fa-solid fa-trophy text-[22px] hover:text-secondary text-primary cursor-pointer"></i>
      
      <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary rounded-full">
          <i class="fa-solid fa-user-group text-[18px] text-black cursor-pointer"></i>
      </div>
      <i class="fa-solid fa-comments text-[22px] hover:text-secondary text-primary cursor-pointer"></i>
      <i class="fa-solid fa-gear text-[22px] hover:text-secondary text-primary cursor-pointer"></i>

    </div>

    <div class="fixed left-[1650px] top-[40px] flex flex-row items-center gap-5 z-50">

      <!-- Language icon -->
      <div class="relative group">
        <button class="flex items-center gap-2 text-primary hover:text-secondary cursor-pointer">
          <i class="fa-solid fa-chevron-down text-xs cursor-pointer"></i>
          En
        </button>

        <ul class="absolute mt-1 rounded-md hidden group-hover:block transition-all duration-200 ease-in-out">
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">En</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">Fr</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">Ar</li>
        </ul>
      </div>

      <i class="fa-regular fa-bell text-primary cursor-pointer hover:text-secondary"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary cursor-pointer hover:text-secondary"></i>
    </div>
  </div>

  <div class="flex flex-row items-center gap-10 fixed left-1/2 -translate-x-1/2 top-[180px]">
    <div class="w-[280px] h-[53px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Friends</div>
    <div class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Invitaions</div>
    <div class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Blocked</div>
  </div>
`;
}