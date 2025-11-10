import "./../styles/index.css";
import Landing from "./pages/landing";
import Chat, { OptionsChat ,closeChat} from './pages/Chat';
import Home from "./pages/home.ts";



// import Chat from "./pages/Chat";

import GameStyle from "./pages/gameStyle";
import Game from "./pages/game";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
// import Settings from "./pages/zzz.ts";
import Settings from "./pages/settings.ts";
import Friends from "./pages/friends.ts";
import Invitations from "./pages/invitaions.ts";
import Blocked from "./pages/blocked.ts";
import gameStyle from "./pages/gameStyle";
import PageNotFound from "./pages/pageNotFound.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = Chat();
OptionsChat(); 
closeChat();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Landing();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Home();

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Landing();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Home();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = GameStyle();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Game();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Login();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Leaderboard();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Settings();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Friends();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Invitations();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Blocked();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = PageNotFound();


export function navigate(path: string) {
  window.location.href = path;
}

export function MoveToPage()
{
  const home = document.getElementById("home");
  const settings = document.getElementById("settings");
  
  home?.addEventListener("click", () => {
    navigate("home.ts");
  });
  
  settings?.addEventListener("click", () => {
    navigate("settings.ts");
  });
}


document.addEventListener('DOMContentLoaded', () => {
  MoveToPage();
});