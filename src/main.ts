import "./../styles/index.css";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Game from "./pages/game.ts";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings.ts";
import Chat, { ChatEventListener } from "./pages/Chat.ts";

import PageNotFound from "./pages/pageNotFound.ts"
// import { notifications, notificationBarListeners, renderNotifications } from "./pages/notifications.ts";


const routes: Record<string, {render: () => string; setUp?: () => void}> = {
    "/": {render: Landing},
    "/home": {render: Home},
    "/game": {render: Game},
    "/leaderboard": {render: Leaderboard},
    "/settings": {render: Settings},
     "/chat": {render: Chat, setUp: ChatEventListener},
    404: {render: PageNotFound},
};

function render(path: string) {
    const app = document.querySelector<HTMLDivElement>("#app");
    const page = routes[path] || routes[404];
    app!.innerHTML = page.render();

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
    sideBarListeners();
    if (page.setUp)
        page.setUp();
    // renderNotifications(notifications);
    // initLogout();
}

function sideBarListeners() {
    const barIcons = document.querySelectorAll<HTMLElement>("aside i[data-path]");
    barIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const path = icon.dataset.path!;
            navigate(path);
        });
    });
}

export function navigate(path: string) {
    console.log("rah 3eyto liya");
    window.history.pushState({}, "", path);
    render(path);
}

window.addEventListener("popstate", () => {
    render(window.location.pathname);
})

window.addEventListener("DOMContentLoaded", () => {
    render(window.location.pathname);
    // notificationBarListeners();
    // LanguagesMenuEventListener();
    // viewFriend();
});
