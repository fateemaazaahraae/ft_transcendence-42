import "./../styles/index.css";
import Landing, { LandingEventListener } from "./pages/landing";
import Home, { HomeEventListener } from "./pages/home";
import RemoteVsLocal, {RemoteVsLocalEventListener} from "./pages/remoteVSlocal.ts";
import LocalMode, { LocalModeEventListener } from "./pages/localMode.ts";
import GameStyle, { GameStyleEventListener } from "./pages/gameStyle.ts";
import LocalGameStyle, { LocalGameStyleEventListener } from "./pages/LocalgameStyle.ts";
import RemoteGameStyle, { RemoteGameStyleEventListener } from "./pages/RemotegameStyle.ts";
import TrWaitingPlayers, { TrWaitingPlayersEventListener } from "./pages/TrWaitingPlayers.ts";
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
import { notificationBarListeners, updateUnreadCount } from "./pages/notifications.ts";
import { LanguagesMenuEventListener } from "./pages/languagesMenu.ts";
import { initLogout } from "./pages/logout.ts";
import Chat from "./pages/Chat.ts";
import { ChatEventListener } from "./pages/chatEventListener.ts";
import { showAlert } from "./utils/alert.ts";
import RemoteGame, { RemoteGameEventListener } from "./pages/RemoteGame.ts";////
import GameInvite, { GameInviteEventListener } from "./pages/GameInvite.ts";////
import FinalMatchTr, { FinalMatchTrEventListener } from "./pages/FinalMatchTr.ts";////
import TournamentGame, { TournamentGameEventListener } from "./pages/TournamentGame.ts";////
import TournamentGametwo, { TournamentGametwoEventListener } from "./pages/TournamentGametwo.ts";////
import { translatePage, getSavedLang, setLang } from "./i18n/index.ts";
import { searchBar } from "./pages/searchBar.ts";
import { tournamentChoices, tournamentChoicesEventListener } from "./pages/tournamentChoices.ts";

const routes: Record<string, { render: () => string | Promise<string>; setUp?: () => void | Promise<() => void> | Promise<void>}> = {
    "/": {render: Landing, setUp: LandingEventListener},
    "/home": {render: Home, setUp: HomeEventListener},
    "/remoteVSlocal": {render: RemoteVsLocal, setUp: RemoteVsLocalEventListener},
    "/localMode" :{ render: LocalMode, setUp: LocalModeEventListener},
    "/gameStyle": {render: GameStyle, setUp: GameStyleEventListener},
    "/LocalgameStyle": {render: LocalGameStyle, setUp: LocalGameStyleEventListener},
    "/RemotegameStyle": {render: RemoteGameStyle, setUp: RemoteGameStyleEventListener},
    "/TrWaitingPlayers": {render: TrWaitingPlayers, setUp: TrWaitingPlayersEventListener},
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
    "/remotegame": { render: RemoteGame, setUp: RemoteGameEventListener },
    "/GameInvite": { render: GameInvite, setUp: GameInviteEventListener },
    "/FinalMatchTr": { render: FinalMatchTr, setUp: FinalMatchTrEventListener },
    "/tournamentgame": {render: TournamentGame, setUp: TournamentGameEventListener },
    "/tournamentgametwo": {render: TournamentGametwo, setUp: TournamentGametwoEventListener },
    "/tournamentChoices": { render: tournamentChoices, setUp: tournamentChoicesEventListener },
    "/pong/:gameId": { render: RemoteGame, setUp: RemoteGameEventListener },
    404: {render: PageNotFound},
};

async function render(path: string) {
    const app = document.querySelector<HTMLDivElement>("#app");
    let page = routes[path] || routes[404];
    
    if (path.startsWith("/pong/")) {
        page = routes["/pong/:gameId"];
    }

    app!.innerHTML = await page.render();  // in case render becomes async


    requestAnimationFrame(() => window.scrollTo(0, 0));
    sideBarListeners();
    if (page.setUp)
        await page.setUp();
    const lang = await getSavedLang();
    translatePage(lang);
    const currentLangBtn = document.getElementById("currentLang");
    if (currentLangBtn)
        currentLangBtn.innerHTML = `<i class="fa-solid fa-chevron-down text-xs"></i> ${lang.toUpperCase()}`;
    initLogout();
    searchBar();
    const userId = localStorage.getItem("userId")
    if (userId)
        notificationBarListeners(userId);
    const logo = document.getElementById("logo");
    logo?.addEventListener("click", () => {
        navigate("/");
    });
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
    const userId = localStorage.getItem("userId")
    if (userId) {
        notificationBarListeners(userId);
        updateUnreadCount(userId);
        setInterval(() => {
            updateUnreadCount(userId);
        }, 2000);
        notificationBarListeners(userId);
    }
    LanguagesMenuEventListener();
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");