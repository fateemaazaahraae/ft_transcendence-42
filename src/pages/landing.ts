export default function Landing() {
  return `
    <div class="w-full flex flex-col items-center pt-40">
      <h1 class="text-black  text-9xl font-glitch  text-center text-shadow-cyan "
      style="-webkit-text-stroke: 5px rgba(53,198,221,0.6);">
        PING PONG <br> LEGENDS
      </h1>
      <div class="w-full flex gap-[10px] justify-center mt-15 items-center ">
      <img src="/images/dark-girl2.png" class="w-auto max-w-[600px] ">
      <img src="/images/table1.png" class=" w-auto max-w-[600px] ">
      <img src="/images/white-boy2.png" class=" w-auto max-w-[600px]">
      </div>
     <div class="relative inline-block group">
      <!-- Button -->
      <button 
        class="font-glitch px-12 py-3 text-2xl bg-black text-white rounded-[50px] 
              drop-shadow-[0_0_10px_#8B3B60] transition-all duration-300 
              group-hover:opacity-0 group-hover:scale-0">
        Play now
      </button>

      <!-- Hover image -->
      <img 
        src="/images/play.png" 
        class="absolute inset-0 mx-auto my-auto w-[70px] z-10 opacity-0 scale-0 
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
      <div class="w-full gap-5 flex justify-center items-center">
      <img src="/images/purple-girl .png" class="w-auto max-w-[500px] -translate-y-[150px]">
      <img src="/images/red-boy.png"w-auto max-w-[500px]">
      <img src="/images/green-girl.png" class=" w-auto max-w-[500px] -translate-y-[150px]">
      </div>
      <h1 class=" text-white font-glitch text-4xl">Owners</h1>
      <div class="w-full gap-[100px] flex justify-center items-center  mt-20">
      <div class="flex flex-col">
      <img src="/images/salma1.png" class="w-auto max-w-[500px]">
      <p class="text-white text-center text-xl font-glitch mt-8">Salma Alaoui</p>
      </div>
      <div class="flex flex-col">
      <img src="/images/fati.png" class="w-auto max-w-[500px] ">
      <p class="text-white text-center text-xl font-glitch mt-8">Fatima zahrae Bazaz</p>
      </div>
      <div class="flex flex-col">
      <img src="/images/keltoum1.png" class=" w-auto max-w-[500px]">
      <p class="text-white text-center text-xl font-glitch mt-8">Keltoum Nacer</p>
      </div>
      <div class="flex flex-col">
      <img src="/images/boushra.png" class=" w-auto max-w-[500px] ">
      <p class="text-white text-center text-xl font-glitch mt-8">Bouchra Benjraife</p>
      </div>
      </div>
    </div>
  `;
}

