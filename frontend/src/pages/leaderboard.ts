import { getSavedLang } from "../i18n";
import { requiredAuth } from "../utils/authGuard";

interface User {
  id: string;
  XPoints: number;
  userName: string;
  profileImage: string;
}

async function fetchMoreInfo(data: User[]): Promise<User[]> {
  return Promise.all(
    data.map(async (leader) => {
      const res = await fetch(`http://localhost:3000/users/${leader.id}`);
      if (!res.ok) return leader;

      const user = await res.json();
      return {
        ...leader,
        userName: user.userName,
        profileImage: user.profileImage
      };
    })
  );
}

async function fetchLeaderboard(): Promise<User[]> {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const res = await fetch(`http://localhost:3003/leaderboard`);
  if (!res.ok)
    return []
  const data: User[] = await res.json()
  return await fetchMoreInfo(data);
}

export default async function Leaderboard() {
  if (!requiredAuth())
    return "";
  const users: User[] = await fetchLeaderboard();
  // if (users.length < 3) {
  //   return `
  //     <div class="min-h-screen flex items-center justify-center text-white text-xl">
  //       Not enough users to display leaderboard
  //     </div>
  //   `;
  // }
  const topThree: User[] = users.slice(0, 3);
  const restUsers: User[] = users.slice(3, 7);
  console.log(topThree);
  console.log(restUsers);
  const currentLang = (await getSavedLang()).toUpperCase();
  return `
  <div class="min-h-screen text-white font-roboto px-6 md:px-20 py-10 relative pb-[90px] overflow-y-auto">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <div data-path="/leaderboard" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
        <i class="fa-solid fa-trophy text-[18px] text-black"></i>
      </div>
      <i data-path="/friends" class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/settings" class="fa-solid fa-gear text-primary hover:text-secondary transition-all duration-400 ease-in-out text-[18px]"></i>
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
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <h1 id="leader" data-i18n="leaderboard" class="text-4xl md:text-5xl font-glitch text-center mt-20 mb-14" ></h1>

    <div class="flex flex-col items-center justify-center relative">

      <!-- Top 3 Container -->
      ${users.length < 1
        ? `<div class="mt-24 text-center font-glitch text-xl md:text-2xl lg:text-3xl xl:text-5xl text-primary/60 text-shadow-cyan text-black">
        Not enough users to display leaderboard
      </div>`
      :
      `<div class="flex flex-wrap justify-center items-end gap-10 md:gap-20">

        <!-- Silver -->
        ${topThree.length < 2
          ? ""
          :
          `<div class="flex flex-col items-center relative">
            <div class="w-[85px] h-[140px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
              <img src="${topThree[1].profileImage}" alt="pink-girl"
                class="w-[60px] h-[60px] object-cover rounded-full border border-primary/50 absolute top-[5px]" />
              <div class="text-white text-[15px] font-roboto font-semibold">${topThree[1].userName}</div>
              <div class="text-white text-[12px] font-roboto font-medium">${topThree[1].XPoints}</div>
              <img src="/silver.svg" alt="silver" class="w-[35px] h-[35px] absolute bottom-[-30px]" />
            </div>
            <div class="w-0 h-0 border-l-[43px] border-l-transparent border-r-[43px] border-r-transparent border-t-[43px] border-t-primary/40"></div>
          </div>`
        }

        <!-- Gold -->
        <div class="flex flex-col items-center relative">
          <div class="w-[90px] h-[160px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
            <img src="${topThree[0].profileImage}" alt="blue-boy"
              class="w-[70px] h-[70px] object-cover rounded-full border border-primary/50 absolute top-[10px]" />
            <div class="text-white text-[15px] font-roboto font-semibold">${topThree[0].userName}</div>
            <div class="text-white text-[12px] font-roboto font-medium">${topThree[0].XPoints}</div>
            <img src="/gold.svg" alt="gold" class="w-[40px] h-[40px] absolute bottom-[-30px]" />
          </div>
          <div class="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-t-[45px] border-t-primary/40"></div>
        </div>

        <!-- Bronze -->
        ${topThree.length < 3
          ? ""
          : `
          <div class="flex flex-col items-center relative">
            <div class="w-[85px] h-[140px] bg-primary/40 flex flex-col items-center justify-end pb-4 relative">
              <img src="${topThree[2].profileImage}" alt="white-boy"
                class="w-[60px] h-[60px] object-cover rounded-full border border-primary/50 absolute top-[5px]" />
              <div class="text-white text-[15px] font-roboto font-semibold">${topThree[2].userName}</div>
              <div class="text-white text-[12px] font-roboto font-medium">${topThree[2].XPoints}</div>
              <img src="/bronze.svg" alt="bronze" class="w-[35px] h-[35px] absolute bottom-[-30px]" />
            </div>
            <div class="w-0 h-0 border-l-[43px] border-l-transparent border-r-[43px] border-r-transparent border-t-[43px] border-t-primary/40"></div>
          </div>
          `
        }

      </div>
    </div>

    <!-- Others -->
    <div class="relative left-1/2 -translate-x-1/2 top-[100px] w-[90%] pb-20 md:pb-0">
      <div class="flex flex-col gap-4 items-center">
        ${restUsers
          .map(
            (leader, index) => `
          <div class="w-[350px] md:w-[500px] h-[50px] bg-primary/40 rounded-lg flex items-center pl-5">
            <div class="flex items-center gap-3">
              <div class="text-white text-[22px] font-roboto font-medium">${index + 4}</div>
              <img src="${leader.profileImage}" class="w-[38px] h-[38px] object-cover rounded-full border border-primary/50" />
              <div class="text-white text-[20px] font-roboto font-semibold truncate w-[200px]">${leader.userName}</div>
            </div>
            <div class="ml-auto w-[130px] h-[50px] bg-secondary rounded-lg flex items-center justify-center">
              <div class="text-white text-[20px] font-roboto font-medium">${leader.XPoints}</div>
            </div>
          </div>

          `
          )
          .join("")}
      </div>
    </div>
  </div>`
}

  `;
}