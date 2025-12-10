import { showAlert } from "../utils/alert"
import en from "./en"
import fr from "./fr"
import sp from "./sp"
import { translateDict } from "./types"

export type Lang = "en" | "fr" | "sp"
const languages: Record<Lang, translateDict> = { en, fr, sp }

export function translatePage(lang: Lang) {
    const dict = languages[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const translation = dict[key as keyof translateDict];
        if (translation)
            el.textContent = translation;
    });
}

export async function getSavedLang(): Promise<Lang> {
    const local = localStorage.getItem("lang") as Lang | null;
    if (local) return local;
    const userId = localStorage.getItem("userId");
    if (!userId)
        return 'en';

    try {
        const res = await fetch(`http://localhost:3000/users/${userId}/language`)
        if (!res.ok) { return 'en'; }
        const data = await res.json();
        return (data.lang as Lang) || "en";
    }
    catch (err) { return 'en'; }
}

export async function setLang(lang: Lang) {
    const userId = localStorage.getItem("userId");
    if (!userId)
        return 'en';
    
    const res = await fetch(`http://localhost:3000/users/${userId}/language`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang })
    });
    const data = await res.json();
    localStorage.setItem("lang", lang);
    translatePage(lang)
}