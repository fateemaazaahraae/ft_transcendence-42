export default function Game(){
  const game={
    match:[
    {
      player1:{
        avatar: "/images/pink-girl.svg",
        name: "Keltoum",
        score: 4,
      }, 
      player2:{
        avatar: "/images/purple-girl.svg",
        name: "tima",
        score: 0, 
      },
    },
  ],
  }; 
  
    return `
    <div class="relative w-full h-screen">

    <!-- Top icons -->
       <div class="absolute top-10 right-[5%] flex items-center gap-6">
      <div class="relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
        <ul class="absolute mt-1 rounded-md hidden group-hover:block bg-black/80 p-2">
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">En</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">Fr</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out">Ar</li>
        </ul>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Game -->
    
    <div class="absolute flex top-[15%] left-[28%]">
        <img src="${game.match[0].player1.avatar}" class="w-[100px] h-[100px] rounded-full border-primary/80 object-cover border-[2px]"/>
        <div class="flex flex-col items-center gap-3 ml-[15%]">
          <h1 class="mt-[5%] font-roboto text-center text-2xl"> ${game.match[0].player1.name} </h1>
          <span class="w-[80px] pt-[6%] h-[40px] rounded-2xl text-center font-roboto text-xl bg-black drop-shadow-cyann" > ${game.match[0].player1.score} </span>
        </div>
        <div class="flex flex-col items-center gap-3 ml-[80%] mr-[15%]">
        <h1 class="mt-[5%] font-roboto text-center text-2xl"> ${game.match[0].player2.name} </h1>
        <span class="w-[80px] pt-[6%] h-[40px] rounded-2xl text-center font-roboto text-xl bg-black drop-shadow-pink" > ${game.match[0].player2.score} </span>
        </div>
        <img src="${game.match[0].player2.avatar}" class="w-[100px] h-[100px] rounded-full border-secondary object-cover border-[2px]"/>
    </div>

    <div class="absolute top-[30%] left-[15%] w-[70%] h-[60%] bg-black rounded-3xl drop-shadow-cyan flex justify-between items-center overflow-hidden">
        <div class="w-[10px] h-[20%]  bg-primary/80 ml-4 "></div>
        <div class="absolute left-1/2 top-0 w-[3px] h-full bg-[#35C6DD]/40  "></div>
        <img src="../../images/ball.png" class ="absolute w-[30px] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2"/>
        <div class="w-[10px] h-[20%]  bg-secondary mr-4 "></div>
    </div>
    </div>
    `;
}