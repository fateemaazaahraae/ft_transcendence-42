export function LanguagesMenuEventListener() {
    const btn = document.getElementById("languageMenu");

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
}