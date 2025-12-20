import { showAlert } from "../utils/alert";
import { User } from "./searchBar";

let card: HTMLDivElement | null = null;
export async function viewFriendProfile(user: User) {
    if (!card) {
        card = document.createElement("div");
        card.id = "friend-card";
        card.className = "fixed insert-0 bg-black/70 flex items-center justify-center z-500";
        card.innerHTML = `
            <div class="w-[350px] bg-primary rounded-2xl p-6 relative">
                <i id="close-friend-card" class="fa-solid fa-xmark absolute top-4 right-8 text-primary cursor-pointer text-xl"></i>
                <img id="profile-img" class="w-28 h-28 rounded-full border-2 border-primary mx-auto object-cover" />
                <h2 id="profile-username" class="text-center text-white font-bold text-xl mt-4"></h2>
                <p id="profile-fullname" class="text-center text-white/80 text-md"></p>
            </div>
        `;
        // showAlert(card)
        document.appendChild(card);
        card.addEventListener("click", (e) => {
            if (e.target === card)
                card!.remove();
        });

        card.querySelector("#close-friend-card")!.addEventListener("click", () => card!.remove());
    }
    (card.querySelector("#profile-img") as HTMLImageElement).src = user.profileImage;
    card.querySelector("#profile-username")!.textContent = user.userName;
    card.querySelector("#profile-fullname")!.textContent = user.firstName + " " + user.lastName;
}