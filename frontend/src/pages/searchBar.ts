import { showAlert } from "../utils/alert";
import { viewFriendProfile } from "./viewFriendProfile";


export type User = {
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    profileImage: string
}

export async function searchBar() {
    const search = document.querySelector(".search-input");
    const results = document.querySelector(".search-results")
    if (!search || !results)
        return ;
    search.addEventListener("input", async (e) => {
        const target = e.target as HTMLInputElement;
        const input = target.value.trim();
        if (!input)
            return ;
        results.innerHTML = "";
        results.classList.add("hidden");
        const token = localStorage.getItem("token");
        if (!token) {
            showAlert("Missing or Invalid token");
            return ;
        }
        try {
            const res = await fetch(`http://localhost:3000/search?search=${input}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const users: User[] = await res.json();
            if (users.length === 0) return ;
            results.classList.remove("hidden")
            users.forEach((user) => {
                const item = document.createElement("div");
                const img = document.createElement("img");
                const content = document.createElement("div");
                content.textContent = user.userName;
                content.className = "font-roboto px-3 py-2 text-sm text-white cursor-pointer";
                img.setAttribute("src", user.profileImage)
                img.className = "w-[35px] h-[35px] object-cover rounded-full border border-primary/50 ml-4";
                item.className = "flex items-center h-[40px] hover:bg-primary/20"
                item.appendChild(img)
                item.appendChild(content)
                results.appendChild(item)
                item.addEventListener("click", () => {
                    viewFriendProfile(user)
                })
            });
        }
        catch(err) {
            showAlert("Error: " + err);
        }
    });

    document.addEventListener("click", (e) => {
        if (!search.contains(e.target as Node)) {
            results.innerHTML = "";
            results.classList.add("hidden")
        }
    });
}