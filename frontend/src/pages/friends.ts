import { getSavedLang } from "../i18n/index.ts";
import { navigate } from "../main.ts";
import { requiredAuth } from "../utils/authGuard.ts";

let friendsList = [
  { name: "smith", color: "bg-greenAdd", img: "/blue-boy.svg" },
  { name: "noah", color: "bg-redRemove", img: "/white-boy.svg" },
  { name: "salaoui", color: "bg-greenAdd", img: "/purple-girl.svg" },
  { name: "oliver", color: "bg-redRemove", img: "/white-boy2.svg" },
  { name: "fateemaazaahrae", color: "bg-greenAdd", img: "/green-girl.svg" },
  { name: "knacer", color: "bg-greenAdd", img: "/dark-girl.svg" },
];

export default function Friends() {
  if (!requiredAuth())
    return "";
  const currentLang: string = getSavedLang().toUpperCase();
  return `
  <div class="h-screen text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">

    <!-- Sidebar -->
    <aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

      <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div data-path="/friends" class="md:w-[40px] md:h-[40px] w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-user-group text-black text-[18px]"></i>
      </div>

      <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/settings" class="fa-solid fa-gear text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
    </aside>

    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="arrow relative group">
        <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          ${currentLang}
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row justify-center items-center gap-2 pt-48 md:gap-5 mb-16">
      <button data-i18n="friends" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
      <button data-i18n="invitations" id="invitationsButton" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
      <button data-i18n="blocked" id="blockedButton" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
    </div>

    <!-- Friends List (Horizontal Scroll) -->
    <div class="max-w-[1000px] mx-auto px-4 md:px-8 pb-20">
      <div class="grid grid-cols-1 gap-6 md:gap-8 overflow-y-auto md:flex md:py-8 md:overflow-x-auto md:scrollbar-thin md:scrollbar-thumb-primary/60 md:scrollbar-track-transparent">

        ${friendsList
          .map(
            (friend) => `
          <div class="flex-none w-[220px] h-[300px] bg-primary/40 rounded-3xl flex flex-col items-center justify-between relative snap-center">
            <div class="absolute top-[15px] left-[15px] w-[10px] h-[10px] ${friend.color} rounded-full"></div>
            <img src="${friend.img}" alt="friend-avatar" class="w-[130px] h-[130px] rounded-full border border-primary/50 object-cover mt-[40px]" />
            <div class="font-roboto font-bold truncate w-[180px] text-center">${friend.name}</div>
            <div class="flex flex-row items-center gap-6 mb-6">
              <i class="fa-solid fa-comment text-[30px] md:text-[35px] text-primary/50 hover:text-primary transition-all duration-400 ease-in-out"></i>
              <button data-i18n="remove" class="remove-btn w-[100px] md:w-[110px] h-[35px] bg-primary/50 rounded-2xl font-roboto font-bold text-[14px] md:text-[15px] hover:bg-redRemove transition-all duration-400 ease-in-out" data-name="${friend.name}"></button>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  </div>
`;
}

export function FriendsEventListener() {
  const blocked = document.getElementById("blockedButton");
  const invitations = document.getElementById("invitationsButton");

  blocked?.addEventListener("click", () => {
    console.log("Blocked Button Clicked");
    navigate("/blocked");
  })

  invitations?.addEventListener("click", () => {
    console.log("Invitations Button Clicked");
    navigate("/invitations");
  })

  const removeFriends = document.querySelectorAll(".remove-btn");
  removeFriends.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Remove Friend Clicked");
      const name = button.getAttribute("data-name");
      friendsList = friendsList.filter((friend) => friend.name !== name);
      navigate("/friends");
    });
  });
}