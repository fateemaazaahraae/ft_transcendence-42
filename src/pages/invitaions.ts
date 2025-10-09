export default function Invitations() {
    return `
  <div class="fixed bottom-[250px] left-6 flex flex-col items-center gap-10 z-50">
      <i class="fa-solid fa-house text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-user text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-trophy text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      
      <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary rounded-full">
          <i class="fa-solid fa-user-group text-[18px] text-black"></i>
      </div>
      <i class="fa-solid fa-comments text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>
      <i class="fa-solid fa-gear text-[22px] hover:text-secondary transition-all duration-400 ease-in-out text-primary"></i>

    </div>

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
  <button class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Friends</button>
  <button class="w-[280px] h-[53px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Invitaions</button>
    <button class="w-[280px] h-[53px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[25px] flex items-center justify-center">Blocked</button>
  </div>

  <!-- Invitations list -->
    <div class="fixed left-1/2 -translate-x-1/2 top-[400px] h-[400px] w-[750px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4">
      <div class="flex flex-col gap-4">

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/blue-boy.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">John</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/red-boy.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">piiw</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/white-boy2.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">ahlele</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/white-boy.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">fta7</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/dark-girl.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">tamo</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/pink-girl.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">ma3ert :)</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>

      <div class="flex items-center bg-primary/40 rounded-[20px] h-[60px] px-6 w-[700px]">
        <div class="flex items-center gap-3 w-1/3 min-w-[200px]">
          <img src="../../images/pink-girl.svg" class="w-[45px] h-[45px] rounded-full border border-primary/50 object-cover">
          <div class="font-roboto font-bold text-[20px] truncate">ma3ert :)</div>
        </div>
        <div class="font-roboto font-bold text-[20px] text-center w-1/3">
          2025-19-09
        </div>
        <div class="flex gap-3 justify-end w-1/3">
          <i class="fa-solid fa-circle-check text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
          <i class="fa-solid fa-circle-xmark text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
        </div>
      </div>
      

    </div>


`;
}