export default function Landing() {
  return `
    <div class="w-full flex flex-col items-center pt-40">
    <div class="relative text-center">
      <h1 class="text-black  text-9xl font-glitch  text-center text-shadow-cyan leading-[1.1]"
      style="-webkit-text-stroke: 5px rgba(53,198,221,0.6);">
        PING PONG <br>
        LEGENDS
        </h1>
        <div class="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[22px] bg-[rgba(53,198,221)] blur-[12px] opacity-100 rounded-full"> </div>
      </div>
      <div class="w-full flex gap-[10px] justify-center mt-15 items-center ">
      <img src="/images/dark-girl.svg" class="drop-shadow-blue w-auto max-w-[400px] ">
      <img src="/images/table1.png" class="mt-20 w-auto max-w-[600px] ">
      <img src="/images/white-boy2.svg" class=" drop-shadow-blue w-auto max-w-[450px]">
      </div>
     <div class="relative inline-block group">
      <button 
        class="mt-10 font-glitch px-12 py-3 text-2xl bg-black text-white rounded-[50px] 
              drop-shadow-cyan transition-all duration-300 
              group-hover:opacity-0 group-hover:scale-0">
        Play now
      </button>
      <img 
        src="/images/match.svg" 
        class="mt-5 absolute inset-0 mx-auto my-auto w-[120px] z-10 opacity-0 scale-0 
              transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" 
      />
      </div>
      <h1 class="mt-[200px] text-white font-glitch text-4xl">Think you've got the reflexes to keep up? </h1>
      <p class="text-white font-roboto text-xl text-center mt-10">
      Step into the thrilling world of ping pong where speed meets strategy.<br/>
      From first-timers to seasoned pros, everyone can dive in and enjoy nonstop<br/>
      action. Challenge the AI in solo mode or face off against friends in intense<br/>
      multiplayer battles. With smooth controls, adjustable difficulty, and fast, dynamic<br/>
      gameplay, every rally will push you to the limit!
      </p>
      <div class="mt-[200px] w-full gap-5 flex justify-center items-center">
      <img src="/images/purple-girl.svg" class="drop-shadow-purple w-auto max-w-[400px] -translate-y-[150px]">
      <img src="/images/red-boy.svg" class=" drop-shadow-red w-auto max-w-[450px]">
      <img src="/images/green-girl.svg" class="drop-shadow-green w-auto max-w-[400px] -translate-y-[150px]">
      </div>
      
      <h1 class=" text-black font-glitch text-6xl mt-[200px] text-shadow-white"
          style="-webkit-text-stroke: 2.5px rgba(255,255,255, 0.9);">Owners</h1>
      <div class="w-full gap-[100px] flex justify-center items-center  mt-20 pb-20">
      <!-- SALMA -->
      <div class="relative flex flex-col group">
      <img src="/images/salma1.png" 
            class="w-auto max-w-[500px] transition-all duration-300 group-hover:blur-[10px]" />
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-xl font-glitch mb-4">Salma Alaoui</p>
      <div class="flex text-white gap-3 text-2xl ">
      <i class="fa-brands fa-github hover:text-[#FD8BD5] transition-colors"></i>
      <i class="fa-brands fa-linkedin hover:text-[#FD8BD5] transition-colors"></i>
      </div>
      </div>
      </div>
      <!-- FATI -->
      <div class="relative flex flex-col group">
      <img src="/images/fati.png" class="w-auto max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <p class="text-white text-xl font-glitch mb-4">Fatima Zahrae Bazaz</p>
        <div class="flex gap-3 text-white text-2xl">
          <i class="fa-brands fa-github hover:text-[#00FFA8] transition-colors"></i>
          <i class="fa-brands fa-linkedin hover:text-[#00FFA8] transition-colors"></i>
        </div>
      </div>
      </div>
      <!-- KELTOUM -->
      <div class="relative flex flex-col group">
      <img src="/images/keltoum1.png" class=" w-auto max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-xl font-glitch mb-4">Keltoum Nacer</p>
      <div class="flex text-white gap-3 text-2xl ">
      <i class="fa-brands fa-github hover:text-[#4D55AC] transition-colors"></i>
      <i class="fa-brands fa-linkedin hover:text-[#4D55AC] transition-colors"></i>
      </div>
      </div>
      </div>
      <!-- BOUCHRA -->
      <div class="relative flex flex-col group">
      <img src="/images/boushra.png" class=" w-auto max-w-[500px] transition-all duration-300 group-hover:blur-[10px]">
      <div class="absolute inset-0 flex flex-col items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <p class="text-white text-center text-xl font-glitch mb-4">Bouchra Benjraife</p>
      <div class="flex text-white gap-3 text-2xl ">
      <i class="fa-brands fa-github hover:text-[#D82674] transition-colors"></i>
      <i class="fa-brands fa-linkedin hover:text-[#D82674] transition-colors"></i>
      </div>
      </div>
      </div>
      </div>
    </div>
  `;
}

