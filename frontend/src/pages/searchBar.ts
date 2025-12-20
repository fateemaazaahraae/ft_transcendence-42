import { showAlert } from "../utils/alert";

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
            type User = {
                id: string,
                userName: string
            }
            const users: User[] = await res.json();
            if (users.length === 0) return ;
            results.classList.remove("hidden")
            users.forEach((user) => {
                const item = document.createElement("div");
                item.textContent = user.userName;
                item.className = "px-3 py-2 text-sm text-white hover:bg-primary/20 cursor-pointer";
                results.appendChild(item)
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