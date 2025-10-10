// import "./../styles/index.css";
// import Landing from "./pages/landing";
// import Login from "./pages/login";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Landing();
// document.querySelector<HTMLDivElement>("#app")!.innerHTML = Login();


import "./../styles/index.css";
import Landing from "./pages/landing";
import Login from "./pages/login";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Small router function
function navigateTo(page: string) {
  if (page === "landing") {
    app.innerHTML = Landing();
    attachLandingEvents();
  } else if (page === "login") {
    app.innerHTML = Login();
  }
}

// Attach events to elements that need JS (like buttons)
function attachLandingEvents() {
  const playBtn = document.querySelector<HTMLButtonElement>("button");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      navigateTo("login");
    });
  }
}

// Start the app on landing page
navigateTo("landing");

