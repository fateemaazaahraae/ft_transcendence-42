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

export function getSavedLang(): Lang {
    return (localStorage.getItem("lang") as Lang) || "en";
}

export function setLang(lang: Lang) {
    localStorage.setItem("lang", lang);
    translatePage(lang);
}