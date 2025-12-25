import "./../styles/index.css";
import Landing, { LandingEventListener } from "./pages/landing";
import Home, { HomeEventListener } from "./pages/home";
import GameStyle, { GameStyleEventListener } from "./pages/gameStyle.ts";
import LocalGameStyle, { LocalGameStyleEventListener } from "./pages/LocalgameStyle.ts";
import RemoteGameStyle, { RemoteGameStyleEventListener } from "./pages/RemotegameStyle.ts";
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
import Settings, { SettingsEventListner } from "./pages/settings.ts";
import Friends, {FriendsEventListener} from "./pages/friends.ts";
import Invitations, {InvitationsEventListener} from "./pages/invitaions.ts";
import Blocked, { BlockedEventListener } from "./pages/blocked.ts";
import PageNotFound from "./pages/pageNotFound.ts"
import { notifications, notificationBarListeners, renderNotifications } from "./pages/notifications.ts";
import { LanguagesMenuEventListener } from "./pages/languagesMenu.ts";
import { initLogout } from "./pages/logout.ts";
import Chat, {ChatEventListener } from "./pages/Chat.ts";
import { showAlert } from "./utils/alert.ts";
import RemoteGame, { RemoteGameEventListener } from "./pages/RemoteGame.ts";////
import { translatePage, getSavedLang, setLang } from "./i18n/index.ts";
import { searchBar } from "./pages/searchBar.ts";
// import { viewFriend } from "./pages/viewFriend.ts";

const routes: Record<string, { render: () => string | Promise<string>; setUp?: () => void | Promise<void> }> = {
    "/": {render: Landing, setUp: LandingEventListener},
    "/home": {render: Home, setUp: HomeEventListener},
    "/gameStyle": {render: GameStyle, setUp: GameStyleEventListener},
    "/LocalgameStyle": {render: LocalGameStyle, setUp: LocalGameStyleEventListener},
    "/RemotegameStyle": {render: RemoteGameStyle, setUp: RemoteGameStyleEventListener},
    "/game": {render: Game},
    "/Localgame": {render: LocalGame, setUp: LocalGameEventListener},
    "/Aigame": {render: AiGame, setUp: AiGameEventListener},
    "/login": {render: Login, setUp: LoginEventListener},
    "/register": {render: Register, setUp: RegisterEventListener},
    "/resetpw": {render: ResetPw, setUp: ResetPwEventListener},
    "/changepw": {render: ChangePw, setUp: ChangePwEventListener},
    "/TwoFactor": {render: TwoFactor, setUp: FactorEventListener},
    "/ChoseAvatar": {render: ChoseAvatar, setUp: ChoseAvatarEventListener},
    "/leaderboard": {render: Leaderboard},
    "/settings": {render: Settings, setUp: SettingsEventListner},
    "/friends": {render: Friends, setUp: FriendsEventListener},
    "/invitations": {render: Invitations, setUp: InvitationsEventListener},
    "/blocked": {render: Blocked, setUp: BlockedEventListener},
    "/chat": {render: Chat, setUp: ChatEventListener},
    "/remote-game": { render: RemoteGame, setUp: RemoteGameEventListener },///
    404: {render: PageNotFound},
};

async function render(path: string) {
    const app = document.querySelector<HTMLDivElement>("#app");
    const page = routes[path] || routes[404];

    // render the page
    app!.innerHTML = await page.render();  // in case render becomes async

    requestAnimationFrame(() => window.scrollTo(0, 0));
    sideBarListeners();
    // run setup if exists
    if (page.setUp)
        await page.setUp();
    const lang = await getSavedLang();
    // const lang = localStorage.getItem(:);
    translatePage(lang);
    const currentLangBtn = document.getElementById("currentLang");
    if (currentLangBtn)
        currentLangBtn.innerHTML = `<i class="fa-solid fa-chevron-down text-xs"></i> ${lang.toUpperCase()}`;
    renderNotifications(notifications);
    initLogout();
    searchBar();
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

export async function navigate(path: string) {
    window.history.pushState({}, "", path);
    await render(path);
}

window.addEventListener("popstate", async() => {
    await render(window.location.pathname);
})

window.addEventListener("DOMContentLoaded", async() => {
    const lang = await getSavedLang();
    translatePage(lang);
    await render(window.location.pathname);
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