import { getSavedLang } from "../i18n";
import { translateMsg } from "../i18n/translateBack";
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
                <div class="flex flex-col justify-center">
                    <h1 data-i18n = "availTour" class="font-glitch text-center text-3xl mb-8">Available tournaments</h1>
                    <div class="flex">
                        <div class="flex flex-col gap-4 h-[600px] w-[600px] mx-auto overflow-y-auto scrollbar scrollbar-thumb-primary/40 scrollbar-track-primary/10 p-4 pb-6">
                                ${
                                    tournaments.length === 0
                                    ? emptyAvTournaments
                                    : tournaments.map(
                                        (tour) => `
                                            <div class="relative flex items-center bg-primary/50 rounded-[20px] px-6 py-[5px] w-full mx-auto">
                                                <img src="/golden_trophy.svg" class="w-[50px] h-[50px] rounded-full border border-primary/50 object-cover"/>
                                                <div class="flex flex-col items-start ml-8">
                                                    <p class="font-bold">${tour.tournamentName}</p>
                                                    <p class="text-white/70 ">4 Players</p>
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
                    <h1 data-i18n = "yours" class="font-glitch text-center text-3xl pt-4">Create yours</h1>
                    <div class="flex flex-col items-center mt-10 gap-12">
                        <div class="relative">
                            <img src="golden_trophy.svg" id="myImg" class="w-[200px] h-[200px] border border-primary rounded-full object-cover" />
                            <i class="fa-solid fa-pen-to-square absolute bottom-6 right-4 md:bottom-9 md:right-5 lg:bottom-6 text-[15px] text-primary/90 cursor-pointer"></i>
                        </div>
                        <form id="tourForm">
                        <div class="flex flex-col gap-6">
                            <input id="tourName" type="text" placeholder="Tournament's name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
                            <input id="nick" type="text" placeholder="Nick name" class="placeholder-white/70 w-[320px] bg-black shadow-[0_0_10px_rgba(53,198,221,0.99)]  rounded-2xl px-6 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] " />
                           
                        </div>
                        <button data-i18n= "create" type="submit" id="submit" class="bg-primary/60 font-glitch h-12 w-40 rounded-full text-2xl hover:bg-secondary mb-16 mt-8 ml-20">Create</button>
                        </form>
                          <div id="avatar-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-50 hidden">
                            <div class="bg-black rounded-[20px] p-10 md:p-10 relative flex flex-col items-center w-[90%] max-w-[700px] drop-shadow-cyan">
                            <i id="close-avatar-modal" class="fa-solid fa-xmark absolute top-4 right-8 text-primary cursor-pointer text-xl"></i>
                            <h2 data-i18n="changeAvt" class="text-white text-center font-glitch text-[30px] mb-10"></h2>
                            <div class="grid grid-cols-4 gap-6" id="avatar-grid">
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/pink-girl.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/dark-girl.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/green-girl.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/purple-girl.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/blue-boy.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/red-boy.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/white-boy.svg" class="w-full h-full object-cover" /></div>
                                <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/white-boy2.svg" class="w-full h-full object-cover" /></div>
                            </div>
                            <div class="flex items-center justify-center mt-7 text-center w-[20px] h-[20px] rounded-full border-[2px] border-primary">
                                <label class="cursor-pointer text-cyan-400 hover:text-cyan-300">+
                                <input type="file" id="avatarUpload" accept="image/*" name="image" class="hidden" />
                                </label>
                            </div>
                            <button data-i18n="save" id="avatar-submit" class="mt-7 w-[20%] text-white bg-black drop-shadow-cyan font-bold hover:bg-primary/60 hover:text-black transition-colors py-2 rounded-[25px] text-[13px]"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}




export async function tournamentChoicesEventListener() {
    
    function setupAvatarModal() {
        const penIcon = document.querySelector(".fa-pen-to-square");
        const modal = document.getElementById("avatar-modal");
        const closeButton = document.getElementById("close-avatar-modal");
        const avatarGrid = document.getElementById("avatar-grid");
        const fileInput = document.getElementById("avatarUpload") as HTMLInputElement;
        const saveButton = document.getElementById("avatar-submit");
    
        if (!penIcon || !modal || !closeButton || !avatarGrid || !saveButton || !fileInput) return;
        let selectedAvatar: string | null = null;
        // open modal
        penIcon.addEventListener("click", () => {
          modal.classList.add("flex");
          modal.classList.remove("hidden");
        });
        // close modal when clicking the x
        closeButton.addEventListener("click", () => {
          modal.classList.remove("flex");
          modal.classList.add("hidden");
        });
        // close modal when clicking outside the box
        modal.addEventListener("click", (event) => {
          if (event.target === modal)
          {
            modal.classList.remove("flex");
            modal.classList.add("hidden");
          }
        });
    
        const avatarOptions = document.querySelectorAll(".avatar");
        avatarOptions.forEach((avatar) => {
          avatar.addEventListener("click", () => {
            avatarOptions.forEach(a => a.setAttribute("data-selected", "false"));
            avatar.setAttribute("data-selected", "true");
            const img = avatar.querySelector("img") as HTMLImageElement;
            selectedAvatar = img.getAttribute("src");
          });
        });
    
        // upload button
        fileInput.addEventListener("change", async () => {
          const file = fileInput.files?.[0];
          if (!file) return;
          const userId = localStorage.getItem("userId");
          if (!userId) {
              showAlert("Login first");
              navigate("/login");
              return;
          }
          const formData = new FormData();
          formData.append("image", file);
          try {
            const res = await fetch(`http://localhost:3000/users/${userId}/upload`, {
                method: "PUT",
                body: formData
            });
            const data = await res.json();
            const translatedMsg = await translateMsg(data.code);
            if (!res.ok) {
                showAlert(translatedMsg);
                return;
            }
            const myImg = document.getElementById("myImg") as HTMLImageElement;
            myImg.src = data.profileImage;
            selectedAvatar = data.profileImage;
            modal.classList.add("hidden");
            showAlert(translatedMsg, "success");
          }
          catch (error) {
            console.error(error);
            showAlert(await translateMsg("NETWORK_ERROR"));
          }
        });
    
        // sending the image to the backend
        saveButton.addEventListener("click", async () => {
          if (!selectedAvatar)
          {
            const translatedMsg = await translateMsg("CHOOSE_AVATAR");
            showAlert(translatedMsg);
            return;
          }
          const userId = localStorage.getItem("userId");
          try {
            const res = await fetch(`http://localhost:3000/users/${userId}/avatar`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ profileImage: selectedAvatar })
            });
            const data = await res.json();
            const translatedMsg = await translateMsg(data.code);
            if (!res.ok) {
              showAlert("Error updating avatar");
              return;
            }
            modal.classList.remove("flex");
            modal.classList.add("hidden");
            (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
            showAlert(translatedMsg, "success");
          }
          catch (err) {
            console.error(err);
            showAlert(await translateMsg("NETWORK_ERROR"))
          }
        });
      }
      setupAvatarModal();
    const form = document.getElementById("tourForm") as HTMLFormElement | null;
    if(!form)
        return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tourName = (document.getElementById("tourName") as HTMLInputElement).value;
      const nickName = (document.getElementById("nick") as HTMLInputElement).value;
      const image = (document.getElementById("myImg") as HTMLImageElement).src;

      try {
          const res = await fetch("http://localhost:3004/createTournament", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({tourName, nickName, image}),
        });

        const data = await res.json();
        if (!res.ok){
            showAlert("Tournament creation failed");
            return;
        }

        console.log("Tournament created:", data);

      } catch (err) {
        console.error(err);
        showAlert("Problem in creation of tournament");
        return;
      }
    });

    //// This is the old code commented!!
// function handleTournamentbtn() {
//     console.log("Create tr button is clicked!");
//     const token = localStorage.getItem("token"); // this will get JWT prolly
//     if (!token) {
//         navigate("/login"); 
//         return;
//     }
//     const socket = getTrSocket(token); /// here is the key to send request to our game server
//     socket.on("connect", () => {
//         console.log("✅ Connected via Manager! ID:", socket.id);
//         navigate("/TrWaitingPlayers");
//         socket.emit('join_queue');
//     });
// }

// export function tournamentChoicesEventListener() {
//     setTimeout(() => {
//         const btnTr = document.getElementById("trcreate");
//         if (btnTr) {
//             btnTr.removeEventListener("click", (handleTournamentbtn));
//             btnTr.addEventListener("click", (handleTournamentbtn));
//         }
//     }, 100);
// }

}
