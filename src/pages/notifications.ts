export function notificationBarListeners() {
    const notificationBell = document.querySelector<HTMLElement>(".fa-bell");
    const notificationBar = document.getElementById("notificationBar");

    notificationBell?.addEventListener("click", () => {
    notificationBar?.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
    if (!notificationBar?.contains(e.target as Node) && !notificationBell?.contains(e.target as Node)) {
        notificationBar?.classList.add("hidden");
    }
    });
}