import { navigate } from "../main.ts";
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
  confirm?.addEventListener("click", ()=>{hideModal();
    navigate("/");
  });
}