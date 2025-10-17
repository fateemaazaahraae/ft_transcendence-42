import "./../styles/index.css";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings.ts";
import Friends, {FriendsEventListener} from "./pages/friends.ts";
import Invitations, {InvitationsEventListener} from "./pages/invitaions.ts";
import Blocked, { BlockedEventListener } from "./pages/blocked.ts";
import PageNotFound from "./pages/pageNotFound.ts"
import { notificationBarListeners } from "./pages/notifications.ts";


const routes: Record<string, {render: () => string; setUp?: () => void}> = {
    "/": {render: Landing},
    "/home": {render: Home},
    "/login": {render: Login},
    "/leaderboard": {render: Leaderboard},
    "/settings": {render: Settings},
    "/friends": {render: Friends, setUp: FriendsEventListener},
    "/invitations": {render: Invitations, setUp: InvitationsEventListener},
    "/blocked": {render: Blocked, setUp: BlockedEventListener},
    404: {render: PageNotFound},
};

function render(path: string) {
    const app = document.querySelector<HTMLDivElement>("#app");
    const page = routes[path] || routes[404];
    app!.innerHTML = page.render();

    sideBarListeners();
    if (page.setUp)
        page.setUp();
}

function sideBarListeners() {
    const barIcons = document.querySelectorAll<HTMLElement>("aside i[data-path]");
    barIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const path = icon.dataset.path!;
            navigate(path);
        });
    });
    notificationBarListeners();
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
    console.log("App loaded");
    render(window.location.pathname);
});
