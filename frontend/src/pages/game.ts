import { requiredAuth } from "../utils/authGuard";

export default function Game() {
  if (!requiredAuth())
    return "";
  const game= {
    match:[
    {
      player1:{
        avatar: "/pink-girl.svg",
        name: "Keltoum",
        score: 4,
      }, 
      player2:{
        avatar: "/purple-girl.svg",
        name: "timaa",
        score: 0, 
      },
    },
  ],
  }; 
  
    return `
    <div class="relative w-full h-screen">

    <!-- Top icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="arrow relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Game -->
    
    <div class="absolute flex top-[15%] md:top-[20%] lg:top-[23%] xl:top-[18%] left-[6%] md:left-[2%] lg:left-[11%] xl:left-[22%] md:translate-x-1/2">
        <img src="${game.match[0].player1.avatar}" class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[3%] lg:ml-[10%] ">
          <h1 class="font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px] "> ${game.match[0].player1.name} </h1>
          <span class=" w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-primary text-xl bg-black drop-shadow-cyann" > ${game.match[0].player1.score} </span>
        </div>
        <div class="flex flex-col items-center gap-1 md:gap-3 ml-[1%] md:ml-[20%] lg:ml-[35%]">
          <h1 class=" font-roboto text-center text-[18px] lg:text-xl xl:text-2xl truncate w-[110px]"> ${game.match[0].player2.name} </h1>
          <span class=" w-[40px] h-[30px] pb-[30%] lg:w-[60px] lg:h-[35px] text-[16px] lg:text-[18px] xl:w-[80px] lg:pt-[6%] xl:h-[40px] rounded-2xl text-center font-roboto text-secondary text-xl bg-black drop-shadow-pink" > ${game.match[0].player2.score} </span>
        </div>
        <img src="${game.match[0].player2.avatar}" class="w-[60px] h-[60px] ml-[1%] md:ml-[3%] lg:ml-[10%] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] rounded-full border-secondary object-cover border-[2px]"/>
    </div>

    <div class="absolute top-[26%] lg:top-[37%] xl:top-[32%] md:top-[32%] left-[15%] w-[70%] h-[65%] lg:w-[70%] lg:h-[50%] xl:h-[60%] bg-black rounded-3xl drop-shadow-cyan lg:flex flex flex-col justify-between items-center overflow-hidden">
        <div class="w-[25%] h-[10px] lg:w-[10px] lg:h-[20%]  bg-primary/80 lg:mr-[98%] lg:mt-[5%] "></div>
        <div class="absolute top-1/2 left-0 lg:left-1/2 lg:top-0 w-full h-[3px] lg:w-[3px] lg:h-full bg-[#35C6DD]/40  "></div>
        <img src="/ball.png" class ="absolute w-[20px] lg:w-[30px] top-1/4 lg:top-1/2 lg:left-1/3 -translate-x-1/2 -translate-y-1/2"/>
        <div class="w-[25%] h-[10px] lg:w-[10px] lg:h-[20%]  bg-secondary lg:ml-[98%] lg:mb-[5%] "></div>
    </div>
    </div>
    `;
}