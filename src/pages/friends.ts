export default function Friends() {
  return `
  <div class="h-screen text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">

    <!-- Sidebar -->
    <aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

      <i class="fa-solid fa-house text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-trophy text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div class="md:w-[40px] md:h-[40px] w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-user-group text-black text-[18px]"></i>
      </div>

      <i class="fa-solid fa-comments text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-gear text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
    </aside>

    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
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
    <div class="flex flex-row justify-center items-center gap-2 pt-48 sm:gap-5 mb-16">
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[15px] sm:text-[25px] flex items-center justify-center">
        Friends
      </button>
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] sm:text-[25px] flex items-center justify-center">
        Invitations
      </button>
      <button class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] sm:text-[25px] flex items-center justify-center">
        Blocked
      </button>
    </div>

    <!-- Friends List (Horizontal Scroll) -->
    <div class="max-w-[1000px] mx-auto px-4 sm:px-8 pb-20 md:px-0">
      <div class="grid grid-cols-1 gap-6 sm:gap-8 sm:overflow-y-auto md:flex md:py-8 md:overflow-x-auto md:scrollbar-thin md:scrollbar-thumb-primary/60 md:scrollbar-track-transparent">

        ${[
          { name: "smith", color: "bg-greenAdd", img: "../../images/blue-boy.svg" },
          { name: "noah", color: "bg-redRemove", img: "../../images/white-boy.svg" },
          { name: "salaoui", color: "bg-greenAdd", img: "../../images/purple-girl.svg" },
          { name: "oliver", color: "bg-redRemove", img: "../../images/white-boy2.svg" },
          { name: "fateemaazaahrae", color: "bg-greenAdd", img: "../../images/green-girl.svg" },
          { name: "knacer", color: "bg-greenAdd", img: "../../images/dark-girl.svg" },
        ]
          .map(
            (friend) => `
          <div class="flex-none w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative snap-center">
            <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] ${friend.color} rounded-full"></div>
            <img src="${friend.img}" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]" />
            <div class="font-roboto font-bold">${friend.name}</div>
            <div class="flex flex-row items-center gap-6 mb-6">
              <i class="fa-solid fa-comment text-[30px] sm:text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
              <button class="w-[100px] sm:w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[14px] sm:text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out">
                Remove
              </button>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  </div>
`;
}
