export const notifications: string[] = [
    "You have new friend requests!",
    "Oliver sent you a message.",
    "Noah invited you to join a game.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
    "tiima sent you a friend request.",
];

export function notificationBarListeners() {
    const bar = document.getElementById("notificationBar");

    document.addEventListener("click", (e) => {
        const bell = document.querySelector<HTMLElement>(".fa-bell");
        if (!bell || !bar)
            return;
        if (bell.contains(e.target as Node)) {
            bar.classList.toggle("hidden");
        } 
        else if (!bar.contains(e.target as Node)) {
            bar.classList.add("hidden");
        }
    });
}


export function renderNotifications(notifs: string[]) {
    const container = document.getElementById('notificationsContainer');
    const bar = document.getElementById('notificationBar');
    
    if (!container || !bar)
        return;
    
    container.innerHTML = '';
    notifs.forEach((notif) => {
        let id = 0;
        const div = document.createElement('div');
        const line = document.createElement('hr');
        div.className = 'text-white font-roboto text-sm px-2 rounded-md';
        div.textContent = notif;
        line.className = 'border-t border-primary/20 my-1';
        container.appendChild(div);
        if (id !== notifs.length - 1)
        {
            container.appendChild(line);
            id++;
        }
  });
}
