export default function Friends() {
    return `
  <diz class="fixed top-1/2 -translate-y-1/2 left-6 flex flex-col items-center gap-10 z-50">
      <i class="fa-solid fa-house text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-user text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-trophy text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      
      <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary rounded-full">
          <i class="fa-solid fa-user-group text-[18px] text-black"></i>
      </div>
      <i class="fa-solid fa-comments text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-gear text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>

    </diz>

    <div class="fixed left-[1650px] top-[40px] flex flex-row items-center gap-5 z-50">

      <!-- Language icon -->
      <div class="relative group">
        <button class="flex items-center gap-2 text-primary hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>

        <ul class="absolute mt-1 rounded-md hidden group-hover:block transition-all duration-400 ease-in-out">
          <li class="px-4 py-2 hover:text-secondary">En</li>
          <li class="px-4 py-2 hover:text-secondary">Fr</li>
          <li class="px-4 py-2 hover:text-secondary">Ar</li>
        </ul>
      </div>

      <i class="fa-regular fa-bell text-primary hover:text-secondary transition-colors duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary transition-colors duration-400 ease-in-out"></i>
    </div>

  <!-- Friends, Invitations, Blocked buttons -->
  <div class="flex flex-row items-center gap-10 fixed left-1/2 -translate-x-1/2 top-[250px]">
    <button class="w-[280px] h-[53px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Friends</button>
    <button class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Invitaions</button>
    <button class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Blocked</button>
  </div>

  <!-- Friends list -->

<div class="fixed left-1/2 -translate-x-1/2 top-[400px] h-[350px] w-[1000px] overflow-x-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
  <div class="grid grid-flow-col auto-cols-[240px] gap-10">
    
    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-greenAdd rounded-full"></div>
      <img src="../../images/blue-boy.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">Smith</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>

    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-redRemove rounded-full"></div>
      <img src="../../images/white-boy.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">Noah</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>
    
    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-greenAdd rounded-full"></div>
      <img src="../../images/purple-girl.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">salaoui</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>
    
    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-redRemove rounded-full"></div>
      <img src="../../images/white-boy2.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">Oliver</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>
    
    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-greenAdd rounded-full"></div>
      <img src="../../images/green-girl.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">fateemaazaahrae</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>
    
    <div class="w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative">
      <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] bg-greenAdd rounded-full"></div>
      <img src="../../images/dark-girl.svg" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]"/>
      <div class="font-roboto font-bold">knacer</div>
      <div class="flex flex-row items-center gap-6 mb-6">
        <i class="fa-solid fa-comment text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
        <button class="w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">Remove</button>
      </div>
    </div>

  </div>
</div>

`;
}