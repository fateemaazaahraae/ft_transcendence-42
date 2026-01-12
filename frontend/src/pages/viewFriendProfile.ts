import { showAlert } from "../utils/alert";
import { GetWinsLosses } from "./home";
import { acceptInvitation, addFriend, blockUser, cancelRequest, unblockUser } from "./relation";
import { User } from "./searchBar";

let card: HTMLDivElement | null = null;

async function getRelationStatus(id: string) {
    const token = localStorage.getItem("token");
    if (!token)
        return;
    try {
        const res = await fetch(`http://localhost:3002/friends/status/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        return data;
    }
    catch (err)
    {
        showAlert("Error: " + err)
    }
}

export async function viewFriendProfile(user: User) {
    let players: any[] = [];
    let myRank: any;
    try {
        const res = await fetch(`http://localhost:3003/leaderboard`);
        if (!res.ok)
        return[];
        players = await res.json();
        const myIndex = players.findIndex(
        (player) => player.id === user.id
        );
        myRank = myIndex !== -1 ? myIndex + 1 : "0";
    }
    catch(err)
    {
    console.log(err);
    return;
    }
    if (!card) {
        card = document.createElement("div");
        card.id = "friend-card";
        card.className = "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9000]";
        card.innerHTML = `
            <div class="flex flex-col items-center justify-center w-[400px] md:w-[600px] bg-primary/50 rounded-2xl p-6 relative animate-[fadeIn_0.25s_ease-out] scale-95">
                <i id="close-friend-card" class="fa-solid fa-xmark absolute top-3 right-4 text-black cursor-pointer text-[16px]"></i>
                <img id="profile-img" class="w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full border-2 border-primary mx-auto object-cover" />
                <h2 id="profile-username" class="font-roboto text-center text-white font-bold text-2xl md:text-3xl mt-5"></h2>
                <p id="profile-fullname" class="font-roboto text-center text-white/80 text-xl md:text-2xl mt-3"></p>
                <div class="lg:gap-3 xl:gap-6 mt-4">
                    <div class="flex text-white font-roboto justify-between text-[10px] md:text-[13px] w-[210px] md:w-[300px] xl:w-[400px]">
                        <p data-i18n="level">Level</p>
                        <p id="level" >7.5%</p>
                    </div>
                    <div class="w-[210px] h-[5px] md:w-[300px] md:h-[8px] xl:w-[400px] xl:h-[12px] bg-secondary rounded-full overflow-hidden relative">
                        <div 
                            id="levelPourcen" class="absolute top-0 left-0 h-full bg-[#35C6DD] rounded-full transition-all duration-700 ease-in-out"
                            style="width: 0%;">
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex text-[10px] md:text-[11px] xl:text-[13px] text-secondary w-[210px] md:w-[300px] h-[12px] md:h-[15px] xl:w-[400px] xl:h-[20px] bg-[#35C6DD]/90 rounded-full justify-between items-center px-4">
                    <p class="font-roboto">
                    <span data-i18n="rank" class="text-white">Rank</span>
                    <span class="text-secondary ml-2">${myRank}</span>
                    </p>
                    <p class="font-roboto">
                    <span data-i18n="score" class="text-white">Score</span>
                    <span id="xpoints" class="text-secondary ml-2"></span>
                    </p>
                </div>
                <div class="relative flex flex-row items-center gap-2 mt-6">
                    <!-- Wins -->
                    <div class="relative group">
                        <p data-i18n="wins" class="text-primary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Wins</p>
                        <span id="Wins" class="absolute font-roboto left-1/2 -translate-x-1/2
                                text-primary text-sm px-3 py-1 rounded-md 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">0</span>
                    </div>
                    <p class="text-white text-xl">/</p>
                    <!-- Losses -->
                    <div class="relative group">
                        <p data-i18n="losses" class="text-secondary font-roboto text-[14px] md:text-[17px] xl:text-xl cursor-pointer group-hover:blur-[3px]">Losses</p>
                        <span id="Losses" class="absolute font-roboto left-1/2 -translate-x-1/2 
                                text-secondary text-sm px-3 py-1 rounded-md 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">0</span>
                    </div>
                </div>
                <button id="button" class="text-center text-white mt-8 font-roboto font-bold text-md bg-secondary rounded-full w-40 h-10"></button>
            </div>
        `;
        // showAlert(card)
        document.body.appendChild(card);
        card.addEventListener("click", (e) => {
            if (e.target === card) {
                card!.remove();
                card = null;
            }
        });

        card.querySelector("#close-friend-card")!.addEventListener("click", () => {
            card!.remove()
            card = null;
        });
    }
    (card.querySelector("#profile-img") as HTMLImageElement).src = user.profileImage;
    card.querySelector("#profile-username")!.textContent = user.userName;
    card.querySelector("#profile-fullname")!.textContent = user.firstName + " " + user.lastName;

    const Wins = card.querySelector("#Wins");
    const Losses = card.querySelector("#Losses");
    const Level = card.querySelector("#level");
    const Score = card.querySelector("#xpoints");
    if (!Wins || !Losses || !Level || !Score) return;
    const data = await GetWinsLosses(user.id);
    if (!data) return;
    Wins.textContent = data.Wins;
    Losses.textContent = data.Losses;
    Score.textContent = data.XPoints;
    const levelRate = data.XPoints / 100;
    Level.textContent = `${levelRate}%`;
    const lvl = card.querySelector("#levelPourcen") as HTMLElement;
    let percentage = levelRate - Math.floor(levelRate);
    percentage = Math.round(percentage * 100) ; 
    if(lvl)
        lvl.style.width = `${percentage}%`;


    const button = card!.querySelector("#button") as HTMLButtonElement;
    const relation = await getRelationStatus(user.id);
    const status = relation?.status;
    button.onclick = null;
    switch (status) {
        case "friend":
            button.textContent = "Block";
            button.onclick = () => blockUser(user.id, () => {
                if (card) {
                    card.remove();
                    card = null;
                }
            });
            break;

        case "pending_received":
            button.textContent = "Accept";
            button.onclick = () => acceptInvitation(user.id, () => {
                if (card) {
                    card.remove();
                    card = null;
                }
            });
            break;
        case "pending_sent":
            button.textContent = "Cancel request";
            button.onclick = () => cancelRequest(user.id, () => {
                if (card) {
                    card.remove();
                    card = null;
                }
            });
            break;

        case "blocked":
            button.textContent = "Unblock";
            button.onclick = () => unblockUser(user.id, () => {
                if (card) {
                    card.remove();
                    card = null;
                }
            });
            break;

        default:
            button.textContent = "Add friend";
            // button.classList.add("bg-primary")
            button.onclick = () => addFriend(user.id, () => {
                if (card) {
                    card.remove();
                    card = null;
                }
            });
    }

}