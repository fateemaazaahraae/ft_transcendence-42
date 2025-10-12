// import "./../styles/index.css";
// // import Landing from "./pages/landing";
// // import Login from "./pages/login";
// import Register from "./pages/register";

// // document.querySelector<HTMLDivElement>("#app")!.innerHTML = Landing();
// // document.querySelector<HTMLDivElement>("#app")!.innerHTML = Login();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Register();


import "./../styles/index.css";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Small router function
function navigateTo(page: string) {
  if (page === "landing") {
    app.innerHTML = Landing();
    attachLandingEvents();
  } else if (page === "login") {
    app.innerHTML = Login();
    attachRegisterEvents();
  } else if (page === "register") {
    app.innerHTML = Register();
  }
}

// Attach events to elements that need JS (like buttons)
function attachLandingEvents() {
  const playBtn = document.querySelector<HTMLButtonElement>("button");
  const logbtn = document.querySelector<HTMLButtonElement>("submit");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      navigateTo("login");
    });
  }
}

function attachRegisterEvents() {
  const playBtn = document.querySelector<HTMLButtonElement>("button");
  const logbtn = document.querySelector<HTMLButtonElement>("submit");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      navigateTo("register");
    });
  }
}

// Start the app on landing page
navigateTo("landing");

