import { messages } from "./backMessages";
import { getSavedLang } from "./index";

export async function translateMsg(code: string) {
    const lang = (await getSavedLang()).toLowerCase() || 'en';
    return messages[lang][code] || code;
}