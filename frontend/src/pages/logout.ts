import { getSavedLang, setLang } from "../i18n/index.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";
export function initLogout(){
    const logoutIcon = document.getElementById("logout-icon");
    const logout = document.getElementById("logout");
    const cancel = document.getElementById("cancel");
    const overlay = document.getElementById("overlay");
    const confirm = document.getElementById("confirm");

    if(!logoutIcon || !logout || !cancel || !overlay) return;

    logoutIcon.addEventListener("click", () => {
    overlay.classList.remove("opacity-0", "invisible");
    overlay.classList.add("opacity-100");
    logout.classList.remove("opacity-0", "invisible");
    logout.classList.add("opacity-100");
  });

  // Hide modal + dark background
  const hideModal = () => {
    overlay.classList.add("opacity-0", "invisible");
    overlay.classList.remove("opacity-100");
    logout.classList.add("opacity-0", "invisible");
    logout.classList.remove("opacity-100");
  };

  cancel.addEventListener("click", hideModal);
  overlay.addEventListener("click", hideModal);
  confirm?.addEventListener("click", async () => {
    hideModal();

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("lang");
    localStorage.clear();
    navigate("/");
  });
}