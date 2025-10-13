export default function Invitations() {
  return `
  <div class="h-screen text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">

    <!-- Sidebar -->
    <aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

      <i class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-user-group text-black text-[18px]"></i>
      </div>

      <i class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-gear text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
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

    <!-- Buttons -->
    <div class="flex flex-row justify-center items-center gap-2 pt-48 md:gap-5 mb-16">
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center">
        Friends
      </button>
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center">
        Invitaions
      </button>
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center">
        Blocked
      </button>
    </div>

    <!-- Invitations list -->
    <div class="fixed left-1/2 -translate-x-1/2 top-[300px] md:top-[350px] h-[400px] w-[90%] md:w-[800px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4 pb-12">
      <div class="flex flex-col gap-4">
        ${[
          {name:"John", img:"../../images/blue-boy.svg", date:"2025-19-09"},
          {name:"piiw", img:"../../images/red-boy.svg", date:"2025-19-09"},
          {name:"ahlele", img:"../../images/white-boy2.svg", date:"2025-19-09"},
          {name:"fta7", img:"../../images/white-boy.svg", date:"2025-19-09"},
          {name:"ahlele", img:"../../images/green-girl.svg", date:"2025-19-09"},
          {name:"fta7", img:"../../images/purple-girl.svg", date:"2025-19-09"},
          {name:"ahlele", img:"../../images/dark-girl.svg", date:"2025-19-09"},
        ]
          .map(
            (invitaions) => `
          <div class="flex flex-row items-center bg-primary/40 rounded-[20px] px-4 py-2 w-full md:w-[700px] mx-auto text-center">
            <div class="flex items-center gap-3 w-1/3 min-w-[130px] h-[30px]">
              <img src="${invitaions.img}" class="w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full border border-primary/50 object-cover">
              <div class="font-roboto font-bold text-[15px] md:text-[20px] truncate">${invitaions.name}</div>
            </div>
            <div class="font-roboto font-normal text-[12px] md:text-[15px] text-center w-1/3">
              ${invitaions.date}
            </div>
            <div class="flex gap-2 md:gap-3 justify-end w-1/3">
              <i class="fa-solid fa-circle-check text-[25px] md:text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out"></i>
              <i class="fa-solid fa-circle-xmark text-[25px] md:text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out"></i>
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