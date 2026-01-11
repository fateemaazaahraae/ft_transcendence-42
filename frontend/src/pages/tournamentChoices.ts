import { getSavedLang } from "../i18n";
import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";

// interface AvTournaments {
//     img: string;
//     name: string;
//     numOfPlayers: number;
// }

export async function tournamentChoices() {
	const emptyAvTournaments = /* html */
	`
	<div class="w-full flex flex-col items-center justify-center py-20  rounded-2xl bg-black drop-shadow-cyan">
		<i class="fa-solid fa-table-tennis-paddle-ball text-7xl mb-12 text-secondary/90"></i>
		<h2 class="text-2xl font-bold mb-2 text-white/70">No tournament available</h2>
	</div>
	`;
	let tournaments: any[] = [];
	try{
		const res = await fetch(`http://localhost:3004/tournaments`);
		if (!res.ok)
			showAlert("error here!!");
		tournaments = await res.json();

	}
	catch(err)
	{
		console.error(err);
	}
   
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
				<div id="availTournament" class="flex flex-col justify-center w-full h-full transition-all duration-300">
					<h1 data-i18n = "availTour" class="font-glitch text-center text-3xl mb-8">Available tournaments</h1>
					<div id="availTournament" class="flex">
						<div class="flex flex-col gap-4 h-[600px] w-[600px] mx-auto overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4 pb-6">
								${
									tournaments.length === 0
									? emptyAvTournaments
									: tournaments.map(
										(tour) => `
											<div class="relative flex items-center bg-primary/50 rounded-[20px] px-6 py-[5px] w-full mx-auto">
												<img src="/golden_trophy.svg" class="w-[55px] h-[55px] rounded-full border border-primary/50"/>
												<div class="flex flex-col items-start ml-8">
													<p class="font-bold">${tour.tournamentName}</p>
													<p class="text-white/70 ">${tour.players} players</p>
												</div>
												<button
												class="join-btn absolute right-6 cursor-pointer text-secondary text-3xl"
												data-tournament-id="${tour.id}"
												aria-label="Join tournament"
												>
												<i class="fa-solid fa-right-to-bracket"></i>
												</button>

											</div>
										`
									)
									.join("")}
						</div> 
					</div>

				</div>
				<!--JOIN TOURNAMENT MODAL -->
				<div id="joinTour" class="fixed  inset-0 z-50 hidden items-center justify-center bg-black/70">
					<div id="joinBox" class="flex flex-col justify-center items-center gap-6 w-[350px] h-[300px] rounded-3xl bg-black drop-shadow-pink">
						<h3 class="text-3xl mt-10 font-glitch text-white/90"> Join Tournament </h3>
						<input id="joinNick" type="text" placeholder="Nick name" class="mt-3 placeholder-white/70 w-[220px] bg-black drop-shadow-pink  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
						<button data-i18n= "join" type="submit" id="joinBtn" class="bg-secondary/90 font-glitch h-12 w-40 rounded-full text-2xl hover:bg-secondary mb-16 mt-4 ">Join</button>
					</div>
				</div>

				<div class="bg-primary/50 h-[700px] w-[3px] rounded-full hidden lg:flex"></div>
				</div>
				<div>
					<h1 data-i18n = "yours" class="font-glitch text-center text-3xl pt-4">Create yours</h1>
					<div class="flex flex-col items-center mt-10 gap-12">
						<div class="relative border border-primary rounded-full">
							<img src="golden_trophy.svg" class="w-[200px] h-[200px] p-2 rounded-full " />
						</div>
						<form id="tourForm">
						<div class="flex flex-col gap-6">
							<input id="tourName" type="text" placeholder="Tournament's name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
							<input id="nick" type="text" placeholder="Nick name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
						   
						</div>
						<button data-i18n= "create" type="submit" id="submit" class="bg-primary/60 font-glitch h-12 w-40 rounded-full text-2xl hover:bg-secondary mb-16 mt-8 ml-20">Create</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	`
}

function handleTournamentbtn(tournamentId: string, nick: string) {
	console.log("Create tr button is clicked!");
	const token = localStorage.getItem("token"); // this will get JWT prolly
	console.log("hereeeeeeeeeeeee" + token);
	if (!token) {
		navigate("/login"); 
		return;
	}
	const socket = getTrSocket(token); /// here is the key to send request to our game server
	socket.on("connect", () => {
		console.log("✅ Connected via Manager! ID:", socket.id);
		navigate("/TrWaitingPlayers");
		socket.emit('join_queue', { tournamentId , nick});
	});
}

export async function tournamentChoicesEventListener() {
	//CREATE TOURNAMENT
	let nick = joinTournament();
	let tournamentId: string;
	const form = document.getElementById("tourForm") as HTMLFormElement | null;
	if(!form)
		return;
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const tourName = (document.getElementById("tourName") as HTMLInputElement).value;
		const nickName = (document.getElementById("nick") as HTMLInputElement).value;
		
		try {
			const res = await fetch("http://localhost:3004/createTournament", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({tourName, nickName}),
			});
			
			const data = await res.json();
			if (!res.ok){
				showAlert("Tournament creation failed");
				return;
			}
			 tournamentId = data.id;
			
			console.log("Tournament created:", data);
			
		} catch (err) {
			console.error(err);
			showAlert("Problem in creation of tournament");
			return;
		}
	});
	const btnTr = document.getElementById("submit");
	if (btnTr) {
		btnTr.addEventListener("click", () => handleTournamentbtn(tournamentId, nick));
		btnTr.removeEventListener("click", () => handleTournamentbtn(tournamentId, nick));
	}

}

//JOIN TOURNAMENT

export function joinTournament(): string {
  const modal = document.getElementById("joinTour");
  const box = document.getElementById("joinBox");
  const input = document.getElementById("joinNick") as HTMLInputElement | null;
  const joinBtn = document.getElementById("joinBtn");
  const tournaments = document.getElementById("availTournament");

  if (!modal || !box || !input || !joinBtn || !tournaments)
	 return "";

  let selectedTournamentId: string | null = null;

  // ✅ Open modal (event delegation)
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".join-btn");
    if (!btn) return;

    selectedTournamentId = btn.getAttribute("data-tournament-id");
    if (!selectedTournamentId) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    tournaments.classList.add(
      "blur-sm",
      "pointer-events-none",
      "select-none"
    );
  });

  // ✅ Click outside modal box → close
  modal.addEventListener("click", (e) => {
    if (!box.contains(e.target as Node)) {
      closeModal();
    }
  });

  // ✅ Join button
  let nick: string;
  nick = "";
  joinBtn.addEventListener("click", () => {
    nick = input.value.trim();
    if (!nick || !selectedTournamentId) {
      return;
    }
    handleTournamentbtn(selectedTournamentId, nick);
    closeModal();
    input.value = "";
  });

  function closeModal() {
    modal?.classList.add("hidden");
    modal?.classList.remove("flex");

    tournaments?.classList.remove(
      "blur-sm",
      "pointer-events-none",
      "select-none"
    );
  }
  return nick;
}
