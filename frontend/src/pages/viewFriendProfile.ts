import { showAlert } from "../utils/alert";
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
    if (!card) {
        card = document.createElement("div");
        card.id = "friend-card";
        card.className = "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9000]";
        card.innerHTML = `
            <div class="flex flex-col items-center justify-center w-[600px] bg-primary/50 rounded-2xl p-6 relative animate-[fadeIn_0.25s_ease-out] scale-95">
                <i id="close-friend-card" class="fa-solid fa-xmark absolute top-3 right-4 text-black cursor-pointer text-[16px]"></i>
                <img id="profile-img" class="w-[300px] h-[300px] rounded-full border-2 border-primary mx-auto object-cover" />
                <h2 id="profile-username" class="font-roboto text-center text-white font-bold text-3xl mt-5"></h2>
                <p id="profile-fullname" class="font-roboto text-center text-white/80 text-2xl mt-3"></p>
                <button id="button" class="text-center text-white font-roboto font-bold text-md bg-secondary rounded-full w-36 h-10 mt-5"></button>
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