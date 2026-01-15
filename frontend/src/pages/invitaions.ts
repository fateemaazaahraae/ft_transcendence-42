import { getSavedLang } from "../i18n/index.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";
import { requiredAuth } from "../utils/authGuard.ts";
import { formatDate } from "../utils/date.ts";

export interface Invitaions {
  sender_id: string;
  userName: string;
  profileImage: string;
  created_at: string;
}

export async function fetchMoreInfo(data: Invitaions[]): Promise<Invitaions[]> {
  return Promise.all(
    data.map(async (friend) => {
      const res = await fetch(`http://localhost:3000/users/${friend.sender_id}`);
      if (!res.ok) return friend;
      const user = await res.json();
      return {
        ...friend,
        userName: user.userName,
        profileImage: user.profileImage,
        created_at: formatDate(friend.created_at)
      };
    })
  );
}

async function fetchInvitations(): Promise<Invitaions[]> {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const res = await fetch(`http://localhost:3002/invitations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return []
  const data = await res.json();
  return await fetchMoreInfo(data)
}

export default async function Invitations() {
  if (!requiredAuth())
    return "";
  const currentLang = (await getSavedLang()).toUpperCase();
  const invitations = await fetchInvitations();
  const emptyInvitationHTML = `
    <div class="w-full flex flex-col items-center justify-center py-20 text-primary/80">
      <i class="fa-solid fa-inbox text-6xl mb-6"></i>
      <h2 class="text-2xl font-bold mb-2">No Invitaions yet</h2>
    </div>
  `
  return `
  <div class="h-screen text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">

    <!-- Sidebar -->
    <aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

      <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
      <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>

      <div data-path="/friends" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-user-group text-black text-[18px]"></i>
      </div>

      <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
      <i data-path="/settings" class="fa-solid fa-gear text-[18px] text-primary hover:text-secondary hover:scale-125 transition-all duration-700 ease-in-out"></i>
    </aside>

    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 left-3"></i>
        <input type="text" placeholder="Search" class="search-input w-[180px] md:w-[280px] font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[2px] border-primary/70">
        <div class="search-results absolute top-full left-0 w-full h-auto backdrop-blur-md mt-1 hidden z-[9000] rounded-xl"></div>
      </div>
      <div class="arrow relative group">
        <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          ${currentLang}
        </button>
      </div>
      <div class="relative">
        <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
        <div id="notifBadge" class="absolute hidden top-1 inset-0 w-[7px] h-[7px] rounded-full bg-red-600"></div>
      </div>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row justify-center items-center gap-2 pt-48 md:gap-5 mb-16">
      <button data-i18n="friends" id="friendsButton" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
      <button data-i18n="invitations" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-black drop-shadow-cyan rounded-3xl text-primary/40 font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
      <button data-i18n="blocked" id="blockedButton" class="md:w-[250px] md:h-[50px] lg:w-[300px] w-[150px] h-[40px] bg-primary/40 rounded-3xl text-black font-roboto font-extrabold tracking-[1px] text-[15px] md:text-[25px] flex items-center justify-center"></button>
    </div>

    <!-- Invitations list -->
    <div class="fixed left-1/2 -translate-x-1/2 top-[300px] md:top-[350px] h-[400px] w-[90%] md:w-[800px] overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4 pb-12">
      <div class="flex flex-col gap-4">
        ${
          invitations.length === 0
          ? emptyInvitationHTML
          : invitations
          .map(
            (invitaion) => `
          <div class="flex flex-row items-center bg-primary/40 rounded-[20px] px-4 py-2 w-full md:w-[700px] mx-auto text-center">
            <div class="flex items-center gap-3 w-1/3 min-w-[130px] h-[30px]">
              <img src="${invitaion.profileImage}" class="w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full border border-primary/50 object-cover">
              <div class="font-roboto font-bold text-[15px] md:text-[20px] truncate">${invitaion.userName}</div>
            </div>
            <div class="font-roboto font-normal text-[12px] md:text-[15px] text-center w-1/3">
              ${invitaion.created_at}
            </div>
            <div class="flex gap-2 md:gap-3 justify-end w-1/3">
              <i class="accept-btn fa-solid fa-circle-check text-[25px] md:text-[35px] text-primary/40 hover:text-greenAdd transition duration-400 ease-in-out" data-id="${invitaion.sender_id}"></i>
              <i class="reject-btn fa-solid fa-circle-xmark text-[25px] md:text-[35px] text-secondary hover:text-redRemove transition duration-400 ease-in-out" data-id="${invitaion.sender_id}"></i>
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

export function InvitationsEventListener() {
  const friendsButton = document.getElementById("friendsButton");
  const blockedButton = document.getElementById("blockedButton");

  friendsButton?.addEventListener("click", () => {
    navigate("/friends");
  })

  blockedButton?.addEventListener("click", () => {
    navigate("/blocked");
  })

  const acceptButtons = document.querySelectorAll(".accept-btn");
  const rejectButtons = document.querySelectorAll(".reject-btn");
  acceptButtons.forEach((button) => {
    button.addEventListener("click", async() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const from = button.getAttribute("data-id");
      const res = await fetch(`http://localhost:3002/friends/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ from })
      });
      showAlert("Invitation accepted successfully", "success");
      navigate("/invitations");
    })
  })
  rejectButtons.forEach((button) => {
    button.addEventListener("click", async() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const request_id = button.getAttribute("data-id");
      const res = await fetch(`http://localhost:3002/friends/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ request_id })
      });
      showAlert("Invitation canceled successfully", "success");
      navigate("/invitations");
    });
  });
}