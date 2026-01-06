import { getTrSocket } from "../utils/tournamentSocket.ts";
import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard.ts";

export default function TrWaitingPlayers() {
  if (!requiredAuth())
    return "";
  return `
  <div class="relative w-full h-screen overflow-x-hidden">


    <!-- Controls Icons -->
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


    <!-- Wait opponent -->

    <h1 id="waitingText"
        class="text-3xl md:text-4xl lg:text-5xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[4%]">
      Waiting For Players<span id="dots">...</span>
    </h1>
    <h2 id="waitingText"
        class="text-3xl md:text-4xl lg:text-4xl font-glitch text-center mt-[40%] md:mt-[20%] lg:mt-[4%]">
      Tournament name
    </h2>
    <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[1%] gap-2 md:gap-[30px]">
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-2 md:gap-10">
              <img id="opponent1"
              src=""
              class="justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] rounded-full border-2 border-primary object-cover">
              <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[120px]" />
              <img id="opponent2"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-primary object-cover
                      opacity-60 transition-opacity duration-300"
              />
          </div>
          <span class="text-white text-[30rem] font-serif font-light">}</span>
          <i class="object-cover fa-solid fa-circle-user text-[100px] md:text-[100px] lg:text-[120px] xl:text-[200px] text-primary/70"></i> 
      </div>
      <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[150px]" />
      <div class="flex flex-row justify-center items-center mt-[8%] lg:mt-[2%] gap-2 md:gap-[3px]">
      <i class="object-cover fa-solid fa-circle-user text-[100px] md:text-[100px] lg:text-[120px] xl:text-[200px] text-secondary/70"></i> 
          <span class="text-white text-[30rem] font-serif">{</span>
          <div class="flex flex-col justify-center items-center mt-[8%] lg:mt-[5%] gap-2 md:gap-10">
              <img id="opponent3"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                      opacity-60 transition-opacity duration-300"
              />
              <img src="/public/vs.svg" class="w-[90px] md:w-[150px] lg:w-[120px]" />
              <img id="opponent4"
              src="/public/opponent1.png"
              class="opponentImg waiting w-[100px] h-[100px] md:w-[200px] md:h-[200px]
                      lg:w-[200px] lg:h-[200px]
                      rounded-full border-2 border-secondary object-cover
                      opacity-60 transition-opacity duration-300"
              />
          </div>
      </div>
    </div>
  </div>
  `;
}

function startWaitingDots() {
  const dots = document.getElementById("dots");
  if (!dots) return;

  let count = 0;
  return setInterval(() => {
    count = (count + 1) % 4;
    dots.textContent = ".".repeat(count);
  }, 500);
}

// function startOpponentImageRotation() {
//   const images = [
//     "/public/dark-girl.svg",
//     "/public/white-boy2.svg",
//     "/public/pink-girl.svg",
//     "/public/purple-girl.svg",
//     "/public/red-boy.svg",
//     "/public/white-boy.svg",
//     "/public/green-girl.svg",
//     "/public/blue-boy.svg",
//   ];

//   return setInterval(() => {
//     const waitingImages = document.querySelectorAll(
//       ".opponentImg.waiting"
//     ) as NodeListOf<HTMLImageElement>;

//     waitingImages.forEach((img) => {
//       img.classList.add("opacity-0");

//       setTimeout(() => {
//         const random = Math.floor(Math.random() * images.length);
//         img.src = images[random];
//         img.classList.remove("opacity-0");
//       }, 550);
//     });
//   }, 1300);
// }

// async function fillSettingsPage()
// {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     // showAlert("Login first");
//     navigate("/login");
//     return ;
//   }
//   try
//   {
//     const res = await fetch(`http://localhost:3001/settings/${userId}`);
//     const data = await res.json();
    
//     // fill page
//     (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
//     // (document.getElementById("userName") as HTMLInputElement).value = data.userName || "";
//   }
//   catch (err)
//   {
//     console.log(err);
//     showAlert("Error while fetching data: " + err);
//   }
// }

export function TrWaitingPlayersEventListener() {
  const socket = getTrSocket(localStorage.getItem("token"));
  startWaitingDots();
  // const RotatingInterval = startOpponentImageRotation();
  window.addEventListener('popstate', () => {
    socket.emit("leave_queue");
    socket.disconnect();
    console.log("You left!!");
    // window.clearInterval(RotatingInterval);
    // leaveGame();
  });
  // fillSettingsPage();
  // socket.on("update_avatars", (data: any) => {
  //   console.log("someoneeee is connecteddd hhhh");
  //   if (data.number === 2) {
  //     console.log("hereeeeeeeeeee number of players iss twoo");
  //     const pl2 = document.getElementById("opponent2") as HTMLImageElement
  //     if (!pl2) return;
  //     pl2.classList.remove("waiting");
  //     // pl2.classList.remove("opacity-70");
  //     // pl2.classList.add("opacity-100");
  //     pl2.classList.add("locked");
  //     console.log(`the size of avatar array is: ${data.avatars.length}`)
  //     pl2.src = data.avatars[1];
  //   }
  //   if (data.number === 3) {
  //     const pl2 = document.getElementById("opponent2") as HTMLImageElement
  //     if (!pl2) return;
  //     pl2.src = data.avatars[1];
  //     const pl3 = document.getElementById("opponent3") as HTMLImageElement
  //     if (!pl3) return;
  //     pl3.classList.remove("waiting");
  //     pl3.classList.add("locked");
  //     pl3.src = data.avatars[2];
  //   }
  //     if (data.number === 4) {
  //     const pl2 = document.getElementById("opponent2") as HTMLImageElement
  //     if (!pl2) return;
  //     pl2.src = data.avatars[1];
  //     const pl3 = document.getElementById("opponent3") as HTMLImageElement
  //     if (!pl3) return;
  //     pl3.classList.remove("waiting");
  //     pl3.classList.add("locked");
  //     pl3.src = data.avatars[2];
  //     const pl4 = document.getElementById("opponent4") as HTMLImageElement
  //     if (!pl4) return;
  //     pl4.classList.remove("waiting");
  //     pl4.classList.add("locked");
  //     pl4.src = data.avatars[3];
  //   }
  // });
    socket.on("update_avatars", (data: any) => {
    if (!Array.isArray(data.avatars)) return;

    data.avatars.forEach((avatar: string, index: number) => {
      if (index === 0) return;

      const img = document.getElementById(`opponent${index + 1}`) as HTMLImageElement;
      if (!img) return;

      img.classList.remove("waiting");
      img.classList.add("locked");
      img.src = avatar;
    });
  });

  socket.on("player_connected", (data: any) => {
    const slotId = `opponent${data.number}`;
    const img = document.getElementById(slotId) as HTMLImageElement;
    if (!img) return;
    console.log("a player connected with the pic: ", data.pic,
        "and number---> ", data.number);
    img.classList.remove("waiting");
    img.classList.remove("opacity-60");
    img.classList.add("opacity-100");
    img.classList.add("locked");
    console.log("deeeebuging :::: ", data.pic);
    img.src = data.pic;
    function updateOpponent(index: number, avatar: string) {
      const el = document.getElementById(`opponent${index}`)

      if (!(el instanceof HTMLImageElement)) return

      el.classList.remove("waiting")
      el.classList.add("locked")
      el.src = avatar
    }
    const opponentCount = Math.min(data.number - 1, data.avatars.length)
    for (let i = 0; i < opponentCount; i++) {
      updateOpponent(i + 1, data.avatars[i])
    }
    // if (data.number === 2) {
    //   const pl1 = document.getElementById("opponent1") as HTMLImageElement
    //   if (!pl1) return;
    //   pl1.src = data.avatars[0];
    // }
    // if (data.number === 3) {
    //   const pl1 = document.getElementById("opponent1") as HTMLImageElement
    //   if (!pl1) return;
    //   pl1.classList.remove("waiting");
    //   pl1.classList.add("locked");
    //   pl1.src = data.avatars[0];
    //   const pl2 = document.getElementById("opponent2") as HTMLImageElement
    //   if (!pl2) return;
    //   pl2.classList.remove("waiting");
    //   pl2.classList.add("locked");
    //   pl2.src = data.avatars[1];
    // }
    // if (data.number === 4) {
    //   const pl1 = document.getElementById("opponent1") as HTMLImageElement
    //   if (!pl1) return;
    //   pl1.classList.remove("waiting");
    //   pl1.classList.add("locked");
    //   pl1.src = data.avatars[0];
    //   const pl2 = document.getElementById("opponent2") as HTMLImageElement
    //   if (!pl2) return;
    //   pl2.classList.remove("waiting");
    //   pl2.classList.add("locked");
    //   pl2.src = data.avatars[1];
    //   const pl3 = document.getElementById("opponent3") as HTMLImageElement
    //   if (!pl3) return;
    //   pl3.classList.remove("waiting");
    //   pl3.classList.add("locked");
    //   pl3.src = data.avatars[2];
    // }
  });
  // function leaveGame() {
  //   console.log("You left!!");
  //   socket.disconnect();
  //   navigate("/gameStyle");
  // }
}
