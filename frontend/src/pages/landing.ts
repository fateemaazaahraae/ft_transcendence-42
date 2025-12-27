import { navigate } from "../main.ts";

export default function Landing() {
  return `
    <div class="w-full h-full flex flex-col items-center pt-40 p-4">
    <div class="relative text-center">
      <h1 class="text-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-glitch text-center text-shadow-cyan leading-[1.1]"
      style="-webkit-text-stroke: 5px rgba(53,198,221,0.6);">
        PING PONG <br>
        LEGENDS
        </h1>
        <div class="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[9px] xl:w-[900px] xl:h-[22px] bg-[rgba(53,198,221)] blur-[12px] opacity-100 rounded-full"> </div>
      </div>
      <div class="w-full flex xl:gap-[10px] justify-center mt-15 items-center ">
      <img src="/dark-girl.svg" class="drop-shadow-blue opacity-0 md:opacity-100 md:w-auto md:max-w-[170px] lg:max-w-[220px] xl:max-w-[400px] ">
      <img src="/table1.png" class="mt-20 w-auto max-w-[320px] lg:max-w-[500px] xl:max-w-[600px] ">
      <img src="/white-boy2.svg" class=" drop-shadow-blue opacity-0 md:opacity-100 md:w-auto md:max-w-[180px] lg:max-w-[220px] xl:max-w-[450px]">
      </div>
      <div class="relative inline-block group">
        <button id="play-btn"
          class="mt-10 font-glitch px-8 lg:px-12 py-3 text-xl bg-black text-white rounded-[50px]
                drop-shadow-cyan transition-all duration-300 group-hover:opacity-0">
          Play now
        </button>
        <img 
          src="/match.svg" 
          class="mt-5 absolute inset-0 mx-auto my-auto w-[120px] z-10 opacity-0 scale-0 
                transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 pointer-events-none" 
        />
      </div>
      <h1 class=" mt-[25%] lg:mt-[180px] xl:mt-[200px] text-white font-glitch text-[18px] md:text-xl lg:text-3xl xl:text-4xl">Think you've got the reflexes to keep up? </h1>
      <p class="text-white font-roboto text-[14px] md:text-[15px] lg:text-xl text-center pl-[5%] pr-[5%] mt-7 lg:mt-10">
      Step into the thrilling world of ping pong where speed meets strategy.<br/>
      From first-timers to seasoned pros, everyone can dive in and enjoy nonstop<br/>
      action. Challenge the AI in solo mode or face off against friends in intense<br/>
      multiplayer battles. With smooth controls, adjustable difficulty, and fast, dynamic<br/>
      gameplay, every rally will push you to the limit!
      </p>
      <div class="mt-[30%] md:mt-[20%] xl:mt-[200px] w-full gap-2 xl:gap-5 flex justify-center items-center">
      <img src="/purple-girl.svg" class="drop-shadow-purple w-auto max-w-[150px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px] -translate-y-[80px] lg:-translate-y-[120px] xl:-translate-y-[150px]">
      <img src="/red-boy.svg" class=" drop-shadow-red w-auto max-w-[180px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[450px]">
      <img src="/green-girl.svg" class="drop-shadow-green w-auto max-w-[160px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px] -translate-y-[80px] lg:-translate-y-[120px] xl:-translate-y-[150px]">
      </div>
      
      <h1 class=" text-black font-glitch text-3xl md:text-4xl lg:text-6xl mt-[25%] md:mt-[20%] xl:mt-[200px] text-shadow-white"
          style="-webkit-text-stroke: 2.5px rgba(255,255,255, 0.9);">Owners</h1>
      <div class="w-full gap-[5%] xl:gap-[100px] flex justify-center items-center mt-[10%]  xl:mt-20 pb-10 lg:pb-20">
      <!-- SALMA -->
      <div class="relative flex flex-col group">
      <img src="/salma1.png" 
            class="w-auto max-w-[80px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[500px] transition-all duration-300 group-hover:blur-[10px]" />
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-[8px] md:text-[14px] lg:text-xl font-glitch mb-1 xl:mb-4">Salma Alaoui</p>
      <div class="flex text-white gap-1 xl:gap-3 text-[14px] md:text-[16px] lg:text-2xl ">
      <a href="https://github.com/salma046" 
         target="_blank" 
         rel="noopener noreferrer">
          <i class="fa-brands fa-github  hover:text-[#FD8BD5] transition-colors"></i>
      </a>
      <a href="https://www.linkedin.com/in/salma-alaoui-b14b46262" 
         target="_blank" 
         rel="noopener noreferrer">
        <i class="fa-brands fa-linkedin hover:text-[#FD8BD5] transition-colors"></i>
      </a>
      </div>
      </div>
      </div>
      <!-- FATI -->
      <div class="relative flex flex-col group">
      <img src="/fati.png" 
            class="w-auto max-w-[80px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <p class="text-white text-[8px] text-center md:text-[14px] lg:text-xl font-glitch mb-1 xl:mb-4">Fatima Zahrae Bazaz</p>
        <div class="flex text-white gap-1 xl:gap-3 text-[14px] md:text-[16px] lg:text-2xl">
          <a href="https://github.com/fateemaazaahraae/" 
              target="_blank" 
              rel="noopener noreferrer">
            <i class="fa-brands fa-github hover:text-[#00FFA8] transition-colors"></i>
          </a>
          <a href="https://www.linkedin.com/in/fatima-zahrae-bazaz/" 
              target="_blank" 
              rel="noopener noreferrer">
            <i class="fa-brands fa-linkedin hover:text-[#00FFA8] transition-colors"></i>
          </a>
        </div>
      </div>
      </div>
      <!-- KELTOUM -->
      <div class="relative flex flex-col group">
      <img src="/keltoum1.png" 
            class=" w-auto lg:max-w-[200px] md:max-w-[150px] max-w-[80px] xl:max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-[8px] md:text-[14px] lg:text-xl font-glitch mb-1 xl:mb-4">Keltoum Nacer</p>
      <div class="flex text-white gap-1 xl:gap-3 text-[14px] md:text-[16px] lg:text-2xl ">
      <a href="https://github.com/" 
         target="_blank" 
         rel="noopener noreferrer">
          <i class="fa-brands fa-github hover:text-[#4D55AC] transition-colors"></i>
      </a>
      <a href="https://www.linkedin.com/feed/" 
         target="_blank" 
         rel="noopener noreferrer"> 
          <i class="fa-brands fa-linkedin hover:text-[#4D55AC] transition-colors"></i>
      </a>
      </div>
      </div>
      </div>
      <!-- BOUCHRA -->
      <div class="relative flex flex-col group">
      <img src="/boushra.png" 
            class=" w-auto lg:max-w-[200px] md:max-w-[150px] max-w-[80px] xl:max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-[8px] md:text-[14px] lg:text-xl font-glitch mb-1 xl:mb-4">Bouchra Benjraife</p>
      <div class="flex text-white gap-1 xl:gap-3 text-[14px] md:text-[16px] lg:text-2xl ">
      <a href="https://www.linkedin.com/feed/" 
         target="_blank" 
         rel="noopener noreferrer">
        <i class="fa-brands fa-github hover:text-[#D82674] transition-colors"></i>
      </a>
      <a href="https://www.linkedin.com/feed/" 
         target="_blank" 
         rel="noopener noreferrer">
        <i class="fa-brands fa-linkedin hover:text-[#D82674] transition-colors"></i>
      </a>
      </div>
      </div>
      </div>
      </div>
    </div>
  `;
}

export function LandingEventListener() {
  const playBtn = document.getElementById("play-btn");
  playBtn?.addEventListener("click", () => {navigate("/login");
  });
}