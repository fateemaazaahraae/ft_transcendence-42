import "./../styles/index.css";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings.ts";
import Friends from "./pages/friends.ts";
import Invitations from "./pages/invitaions.ts";
import Blocked from "./pages/blocked.ts";
import PageNotFound from "./pages/pageNotFound.ts"


const routes: Record<string, () => string> = {
    404: PageNotFound,
    "/": Landing,
    "/home": Home,
    "/login": Login,
    "/leaderboard": Leaderboard,
    "/settings": Settings,
    "/friends": Friends,
    "/invitations": Invitations,
    "/blocked": Blocked,
};

function render(path: string) {
    const app = document.querySelector<HTMLDivElement>("#app");
    const page = routes[path] || routes[404];
    app!.innerHTML = page();

    sideBarListners();
}

function sideBarListners() {
    const barIcons = document.querySelectorAll<HTMLElement>("aside i[data-path]");
    barIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const path = icon.dataset.path!;
            render(path);
        });
    });
}

export function navigate(path: string) {
    window.history.pushState({}, "", path);
    render(path);
}

window.addEventListener("popstate", () => {
    render(window.location.pathname);
})

window.addEventListener("DOMContentLoaded", () => {
  render(window.location.pathname);
});