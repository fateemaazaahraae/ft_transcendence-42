import "./../styles/index.css";
import Landing, { LandingEventListener } from "./pages/landing";
import Home, { HomeEventListener } from "./pages/home";
import GameStyle, { GameStyleEventListener } from "./pages/gameStyle.ts";
import LocalGameStyle, { LocalGameStyleEventListener } from "./pages/LocalgameStyle.ts";
import Game from "./pages/game.ts";
import LocalGame, { LocalGameEventListener } from "./pages/Localgame.ts";
import AiGame, { AiGameEventListener } from "./pages/Aigame.ts";
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
import { LanguagesMenuEventListener } from "./pages/languagesMenu.ts";
import { initLogout } from "./pages/logout.ts";
import Chat from "./pages/Chat.ts";
import { showAlert } from "./utils/alert.ts";
// import { viewFriend } from "./pages/viewFriend.ts";

const routes: Record<string, {render: () => string; setUp?: () => void}> = {
    "/": {render: Landing, setUp: LandingEventListener},
    "/home": {render: Home, setUp: HomeEventListener},
    "/gameStyle": {render: GameStyle, setUp: GameStyleEventListener},
    "/LocalgameStyle": {render: LocalGameStyle, setUp: LocalGameStyleEventListener},
    "/game": {render: Game},
    "/Localgame": {render: LocalGame, setUp: LocalGameEventListener},
    "/Aigame": {render: AiGame, setUp: AiGameEventListener},
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
    "/chat": {render: Chat},
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
    initLogout();
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
    notificationBarListeners();
    LanguagesMenuEventListener();
    // viewFriend();
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
// if (token) {
//   localStorage.setItem("jwt", token);

//   window.history.replaceState({}, document.title, "/home");
//   window.location.href = "/home";
// }