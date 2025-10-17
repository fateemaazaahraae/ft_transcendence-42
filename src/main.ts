import "./../styles/index.css";
import Landing, { LandingEventListener } from "./pages/landing";
import Home, { HomeEventListener } from "./pages/home";
import GameStyle, { GameStyleEventListener } from "./pages/gameStyle.ts";
import Game from "./pages/game.ts";
import Login, { LoginEventListener } from "./pages/login";
import Register, { RegisterEventListener } from "./pages/register.ts";
import ResetPw, { ResetPwEventListener } from "./pages/resetpw.ts";
import TwoFactor, { FactorEventListener } from "./pages/TwoFactor.ts";
import ChangePw, { ChangePwEventListener } from "./pages/changepw.ts";
import ChoseAvatar, { ChoseAvatarEventListener } from "./pages/ChoseAvatar.ts";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings.ts";
import Friends, {FriendsEventListener} from "./pages/friends.ts";
import Invitations, {InvitationsEventListener} from "./pages/invitaions.ts";
import Blocked, { BlockedEventListener } from "./pages/blocked.ts";
import PageNotFound from "./pages/pageNotFound.ts"
import { notifications, notificationBarListeners, renderNotifications } from "./pages/notifications.ts";


const routes: Record<string, {render: () => string; setUp?: () => void}> = {
    "/": {render: Landing, setUp: LandingEventListener},
    "/home": {render: Home, setUp: HomeEventListener},
    "/gameStyle": {render: GameStyle, setUp: GameStyleEventListener},
    "/game": {render: Game},
    "/login": {render: Login, setUp: LoginEventListener},
    "/register": {render: Register, setUp: RegisterEventListener},
    "/resetpw": {render: ResetPw, setUp: ResetPwEventListener},
    "/changepw": {render: ChangePw, setUp: ChangePwEventListener},
    "/TwoFactor": {render: TwoFactor, setUp:FactorEventListener},
    "/ChoseAvatar": {render: ChoseAvatar, setUp:ChoseAvatarEventListener},
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

    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
    sideBarListeners();
    if (page.setUp)
        page.setUp();
    renderNotifications(notifications);
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
    console.log("App loaded");
    render(window.location.pathname);
    notificationBarListeners();
});
