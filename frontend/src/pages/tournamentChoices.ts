import { getSavedLang } from "../i18n";
import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";

interface AvTournaments {
    img: string;
    name: string;
    numOfPlayers: number;
}

export async function tournamentChoices() {
    const emptyAvTournaments = /* html */
    `
    <div class="w-full flex flex-col items-center justify-center py-20 text-primary/80 rounded-2xl bg-black drop-shadow-cyan">
        <i class="fa-solid fa-table-tennis-paddle-ball text-7xl mb-12"></i>
        <h2 class="text-2xl font-bold mb-2">No tournament available</h2>
    </div>
    `;
    const avTournaments: AvTournaments[] = [
        {img: "/dark-girl.svg", name: "Pong legends", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "tournowa d ramadan", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "tajamo3 l a7rar", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3},
        {img: "/dark-girl.svg", name: "wewewewe", numOfPlayers: 3}
    ];
    const currentLang = (await getSavedLang()).toUpperCase();
    return `
        <div class="text-white font-roboto px-6 md:px-20 py-10 relative">
            <!-- Sidebar -->
            <aside
                class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
                bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
                flex justify-around md:justify-normal items-center py-3 md:py-0
                md:bg-transparent md:backdrop-blur-0 z-50">

                <div data-path="/home" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
                <i class="fa-solid fa-house text-[18px] text-black"></i>
                </div>
                <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
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

            <!-- Content Wrapper-->
            <div class="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_1fr] max-w-[1400px] max-h-[70px] md:ml-[10%] lg:ml-[5%] xl:ml-[14%] mt-36">
                <div class="md:flex md:gap-32">
                <div class="flex flex-col justify-center">
                    <h1 class="font-glitch text-center text-3xl mb-8">Available tournaments</h1>
                    <div class="flex">
                        <div class="flex flex-col gap-4 h-[600px] w-[600px] mx-auto overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4 pb-6">
                                ${
                                    avTournaments.length === 0
                                    ? emptyAvTournaments
                                    : avTournaments.map(
                                        (tour) => `
                                            <div class="relative flex items-center bg-primary/50 rounded-[20px] px-6 py-[5px] w-full mx-auto">
                                                <img src="${tour.img}" class="w-[55px] h-[55px] rounded-full border border-primary/50 object-cover"/>
                                                <div class="flex flex-col items-start ml-8">
                                                    <p class="font-bold">${tour.name}</p>
                                                    <p class="text-white/70 ">${tour.numOfPlayers} Players</p>
                                                </div>
                                                <i class="fa-solid fa-right-to-bracket text-secondary text-3xl absolute right-6 cursor-pointer"></i>
                                            </div>
                                        `
                                    )
                                    .join("")}
                        </div>
                    </div>
                </div>
                <div class="bg-primary/50 h-[700px] w-[3px] rounded-full hidden lg:flex"></div>
                </div>
                <div>
                    <h1 class="font-glitch text-center text-3xl pt-4">Create yours</h1>
                    <div class="flex flex-col items-center mt-10 gap-12">
                        <div class="relative">
                            <img src="white-boy.svg" class="w-[200px] h-[200px] border border-primary rounded-full object-cover" />
                            <i class="fa-solid fa-pen-to-square absolute bottom-6 right-4 md:bottom-9 md:right-5 lg:bottom-6 text-[15px] text-primary/90 cursor-pointer"></i>
                        </div>
                        <div class="flex flex-col gap-6">
                            <input type="text" placeholder="Tournament's name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
                            <input type="text" placeholder="Nick name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
                            <div class="relative">
                                <input type="text" placeholder="Add players" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
                                <i class="fa-solid fa-plus absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-secondary"></i>
                            </div>
                        </div>
                        <button id=trcreate class="bg-primary/60 font-glitch h-12 w-40 rounded-full text-2xl hover:bg-secondary mb-16">Create</button>
                    </div>
                </div>
            </div>
        </div>
    `
}


export function tournamentChoicesEventListener(){
  setTimeout(() => {
  const btnTr = document.getElementById("trcreate");
  if (btnTr) {
    btnTr.addEventListener("click", () => {
      console.log("Create tr button is clicked!");

      const token = localStorage.getItem("token"); // this will get JWT prolly
      if (!token) {
        navigate("/login"); 
        return;
      }

      const socket = getTrSocket(token); /// here is the key to send request to our game server

    //   if (!socket.hasListeners("match_found")) {
          
          socket.on("connect", () => {
              console.log("✅ Connected via Manager! ID:", socket.id);
              navigate("/TrWaitingPlayers");
              socket.emit('join_queue');
          });

        //   socket.on("match_found", (data: any) => {
        //       console.log("🎉 MATCH FOUND! Navigating to game...");
        //       localStorage.setItem("currentMatch", JSON.stringify(data));
        //       navigate("/remotegame"); 
        //   });
    //   }

    //   if (socket.connected) {
    //         socket.emit('join_queue');
    //   }
    });
  }
}, 100);
}

