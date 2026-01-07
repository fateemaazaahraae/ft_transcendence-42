import { getSavedLang } from "../i18n/index.ts";

export default async function PageNotFound() {
   const currentLang = (await getSavedLang()).toUpperCase();
 return `
  <div class="fixed inset-0 flex flex-col items-center justify-center text-center overflow-hidden">

    <!-- Glitch 404 text -->
    <h1 class="text-[80px] md:text-[120px] lg:text-[150px] font-glitch tracking-[10px] 
               drop-shadow-cyan
               before:content-['404'] before:absolute before:left-0 before:text-secondary 
               before:translate-x-[5px] before:top-0 before:animate-glitch 
               after:content-['404'] after:absolute after:left-0 after:text-black
               after:-translate-x-[3px] after:top-0 after:animate-glitch-slow">
      404
    </h1>

    <!-- Subtitle -->
    <p data-i18n="notFound" class="text-3xl md:text-6xl lg:text-8xl mt-4 text-black drop-shadow-pink animate-glitch font-glitch z-10">Page Not Found</p>
</div>
   
`;

}