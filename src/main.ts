import "./../styles/index.css";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Settings from "./pages/settings";
import Friends from "./pages/friends";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = Landing();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Login();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Leaderboard();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Settings();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Friends();