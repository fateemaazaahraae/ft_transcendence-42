import { setLang, getSavedLang, translatePage, type Lang } from "../i18n/index";
import { showAlert } from "../utils/alert";

export function LanguagesMenuEventListener() {
    const btn = document.getElementById("languageMenu");
    // const currentLangBtn = document.getElementById("currentLang");

    document.addEventListener("click", (e) => {
        console.log("Language menu clicked");
        const arrow = document.querySelector<HTMLElement>(".arrow");
        if (!arrow || !btn)
            return;
        if (arrow.contains(e.target as Node)) {
            btn.classList.toggle("hidden");
        } 
        else if (!btn.contains(e.target as Node)) {
            btn.classList.add("hidden");
        }
    });

    if (!btn) return;
    const items = btn.querySelectorAll<HTMLLIElement>("li");
    items.forEach((item) => {
        item.addEventListener("click", async() => {
            const lang = (item.dataset.lang || "en") as Lang;
            await setLang(lang);
            // showAlert("heeeereee XD " );
            // const l = localStorage.getItem("lang")
            btn.classList.add("hidden");
            const currentLangBtn = document.getElementById("currentLang");
            if (currentLangBtn)
                currentLangBtn.innerHTML = `<i class="fa-solid fa-chevron-down text-xs"></i> ${lang.toUpperCase()}`;
            translatePage(lang);
        })
    });
    // if (currentLangBtn)
    //     currentLangBtn.innerHTML = `<i class="fa-solid fa-chevron-down text-xs"></i> ${getSavedLang().toUpperCase()}`;
}