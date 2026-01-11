import { showAlert } from "../utils/alert";

type Notification = {
    id: string;
    user_id: number;
    type: string;
    payload: { fromUserId?: number, fromUserName?: string };
    is_read: number;
    created_at: string;
};

export async function fetchNotifications(userId: string) {
    try {
        const response = await fetch(`http://localhost:3005/notifications/${userId}`);
        if (!response.ok)
            throw new Error("Failed to fetch notifications");
        const data = await response.json();
        return data; // array of notifications
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

async function fetchUnreadNotifications(userId: string): Promise<number> {
    try {
        const res = await fetch(`http://localhost:3005/notifications/${userId}/unread-count`);
        if (!res.ok)
            throw new Error("Failed to fetch unread count");
        const data = await res.json()
        return data.count;
    }
    catch(err) {
        showAlert("Error " + err);
        console.log(err);
        return 0
    }
}

export async function updateUnreadCount(userId: string) {
    const notifCount = document.getElementById("notifBadge");
    if (!notifCount) return;
    const count = await fetchUnreadNotifications(userId);
    if (count > 0)
        notifCount.classList.remove("hidden")
    else
        notifCount.classList.add("hidden")
}

async function markAllNotificationsAsRead(userId: string) {
    await fetch(`http://localhost:3005/notifications/${userId}/read-all`, {
        method: "PUT"
    })
}

export function notificationBarListeners(userId: string) {
    const bar = document.getElementById("notificationBar");
    const bell = document.querySelector<HTMLElement>(".fa-bell");

    document.addEventListener("click", async(e) => {
        if (!bell || !bar)
            return;
        if (bell.contains(e.target as Node)) {
            bar.classList.toggle("hidden");
            if (!bar.classList.contains("hidden")) {
                const notifs = await fetchNotifications(userId);
                renderNotifications(notifs);
                await markAllNotificationsAsRead(userId)
                await updateUnreadCount(userId)
                console.log("12345 heeeerrrrrreee")
            }
        } 
        else if (!bar.contains(e.target as Node)) {
            bar.classList.add("hidden");
        }
    });
}

export function renderNotifications(notifs: Notification[]) {
    const container = document.getElementById('notificationsContainer');
    if (!container)
        return;
    container.innerHTML = '';
    notifs.forEach((notif, index) => {
        const div = document.createElement('div');
        const line = document.createElement('hr');
        div.className = 'text-white font-roboto text-sm px-2 rounded-md';
        switch (notif.type) {
            case "FRIEND_REQUEST":
                div.textContent = `👤​ ${notif.payload.fromUserName} sent you a friend request.`;
                break;
            case "FRIEND_REQUEST_ACCEPTED":
                div.textContent = `✅​ ${notif.payload.fromUserName} accepted your friend request.`;
                break;
            case "MESSAGE":
                div.textContent = `✉️​ ${notif.payload.fromUserName} sent you a message.`;
                break;
            case "GAME_INVITE":
                div.textContent = `🎮​ ${notif.payload.fromUserName} invited you to join a game.`;
                break;
            default:
                div.textContent = "You have a new notification.";
        }
        line.className = 'border-t border-black/40 my-1';
        container.appendChild(div);
        if (index !== notifs.length - 1) {
            container.appendChild(line);
        }
  });
}
