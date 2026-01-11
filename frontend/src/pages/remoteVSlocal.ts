import { navigate } from "../main.ts";
import { getSavedLang } from "../i18n/index.ts";
import { translateMsg } from "../i18n/translateBack";
import { requiredAuth } from "../utils/authGuard";

export default async function RemoteVsLocal(){
    if (!requiredAuth())
        return "";

    const currentLang = (await getSavedLang()).toUpperCase();
    return`
        <div class="relative w-full h-screen overflow-x-hidden">
            <!-- Sidebar -->
            <aside
                class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
                bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
                flex justify-around md:justify-normal items-center py-3 md:py-0
                md:bg-transparent md:backdrop-blur-0 z-50">

            <div data-path="/home" class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
                <i class="fa-solid fa-house text-[18px] text-black"></i>
            </div>
            <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
            <i data-path="/friends" class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
            <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
            <i data-path="/settings" class="fa-solid fa-gear text-primary hover:text-secondary transition-all duration-400 ease-in-out text-[18px]"></i>

            </aside>


             <!-- Controls Icons -->
            <div class="absolute top-10 right-[5%] flex items-center gap-4">
            <div class="relative">
                <i class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 left-3"></i>
                <input type="text" placeholder="Search" class="search-input w-[180px] md:w-[280px] font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[2px] border-primary/70">
                <div class="search-results absolute top-full left-0 w-full h-auto backdrop-blur-md mt-1 hidden z-[9000] rounded-xl"></div>
            </div>
            <div class="arrow relative group">
                <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
                <i class="fa-solid fa-chevron-down text-xs"></i>
                ${currentLang}
                </button>
            </div>
            <div class="relative">
                <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
                <div id="notifBadge" class="absolute hidden top-1 inset-0 w-[7px] h-[7px] rounded-full bg-red-600"></div>
            </div>
            <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
            </div>

            <!-- Remote OR Local -->
                <div class="min-h-screen flex flex-col items-center justify-center gap-0 md:gap-5 lg:gap-10">

                    <div
                    class="relative font-glitch inline-flex items-center justify-center
                            uppercase tracking-[2px] lg:tracking-[5px]
                            xl:text-6xl lg:text-5xl md:text-3xl text-[18px]
                            mb-12 whitespace-nowrap text-center leading-none"
                    >

                        <span data-i18n="modePlay" class="absolute text-secondary animate-glitch-slow  z-20">
                        How do you prefer to play?
                        </span>

                        <span data-i18n="modePlay" class="absolute  translate-x-[1px] translate-y-[1px] text-primary z-40">
                        How do you prefer to play?
                        </span>

                        <span data-i18n="modePlay" class="absolute translate-x-[15px] translate-y-[25px]  text-white/95 animate-glitch z-50">
                        How do you prefer to play?
                        </span>
                    </div>


                    <div class =" flex gap-[5%] w-full items-center justify-center">
                        <button data-i18n="remote" id="remote" class="w-[100px] h-[50px] text-[15px] md:w-[150px] md:h-[60px] md:text-xl lg:w-[200px] lg:h-[80px] bg-black rounded-[20px] font-roboto font-bold lg:text-2xl drop-shadow-cyan hover:bg-primary"> Remote </button>
                        <span data-i18n="or" class=" font-roboto text-[17px] md:text-xl"> OR </span>
                        <button data-i18-n="local" id="local" class="w-[100px] h-[50px] text-[15px] md:w-[150px] md:h-[60px] md:text-xl lg:w-[200px] lg:h-[80px] bg-black rounded-[20px] font-roboto font-bold lg:text-2xl drop-shadow-pink hover:bg-secondary"> Local </button>
                    </div>
                </div>
        </div> 
    `
}

export async function RemoteVsLocalEventListener(){
    const remote = document.getElementById("remote");
    remote?.addEventListener("click", () => {
        navigate("/gameStyle");
    });
    const local = document.getElementById("local");
    local?.addEventListener("click", () => {
        navigate("/localMode");
    });
}
