import { navigate } from "../main.ts";
export default function ChoseAvatar() {
  return `<div class="min-h-screen w-full flex items-center justify-center gap-[8px] relative pt-[3%]">

    <div class="relative inset-0 items-center h-[550px] md:h-[750px] w-full md:w-[820px] pt-[75px] md:pt-[130px] rounded-[50px] overflow-hidden mr-[3%] ">

        <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[265px] md:h-[170px] bg-[#35C6DDE5] left-[calc(50%-175px)] md:left-[calc(50%-320px)]  top-[15%] md:top-[24%] -rotate-[20deg] md:rotate-[63deg]"></div>
        <div class="absolute rounded-full blur-[55px] opacity-110 w-[90px] h-[300px] md:w-[300px] md:h-[250px] bg-[#D02EA48A] right-[calc(50%-106px)] md:left-[calc(50%-20px)] md:bottom-[60%] top-[40%] md:top-[48%] -rotate-[35deg] md:rotate-[45deg]"></div>

        <div class="relative inset-0 m-auto w-[320px] md:w-[480px] lg:w-[480px] h-[310px] md:h-[390px] px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[50px]">
          <form action="">
            <h2
                class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[25px]">
              Choose your avatar
            </h2>
            <div class="grid grid-cols-4 gap-6 mb-6" id="avatar-grid">
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/blue-boy.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/green-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/white-boy2.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/dark-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/pink-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/white-boy.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/purple-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/images/red-boy.svg" class="w-full h-full object-cover"/>
              </div>
            </div>

            <div id="upload-section" class="flex flex-col items-center mb-16">
              <label for="avatarUpload"
              class="cursor-pointer text-cyan-400 hover:text-cyan-300 transition">
              + Upload your own avatar
              </label>
              <input type="file" id="avatarUpload" accept="image/*" class="hidden" />
            </div>

            <div id="preview-avatar" class="mx-auto"></div> <!-- I added here the height variable -->

            <button id="back-to-avatars"
              class="hidden mt-3 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full transition">
              Back to default avatars
            </button>

            <button type="submit" id="sign"
              class="flex w-[45%] h-[37px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[20px] rounded-[50px] cursor-pointer mt-7 md:mt-10 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
              Sign Up
            </button>
          </form>
        </div>
        </div>
  </div>
  `;
}


export function ChoseAvatarEventListener() {

  const sign= document.getElementById("sign");
  sign?.addEventListener("click", () =>{navigate("/home");
  });

  // to change the border color when an avatar is selected
  const avatarGrid = document.getElementById("avatar-grid") as HTMLElement | null; // we got avatarGrid id so after we will need to hide the avatars that's why
  if (!avatarGrid) return;

  const avatars = Array.from(avatarGrid.querySelectorAll<HTMLElement>("div"));
  avatars.forEach((avatar) => {
    avatar.addEventListener("click", () => {
      avatars.forEach((a) => (a.dataset.selected = "false"));
      avatar.dataset.selected = "true";
    });
  });

  // handle when the user enters an img input && preview that image with hiding other avatars && handle when back to avatars btn is clicked
  const fileInput = document.getElementById("avatarUpload") as HTMLInputElement | null;
  const previewEl = document.getElementById("preview-avatar") as HTMLElement | null;
  const backBtn = document.getElementById("back-to-avatars") as HTMLButtonElement | null;

  if (!fileInput || !previewEl || !backBtn) return;

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const AvatarUrl = URL.createObjectURL(file);

    previewEl.innerHTML = `<img src="${AvatarUrl}" class="w-full h-[20px]" />`

    avatarGrid.classList.add("hidden");
    previewEl.classList.remove("hidden");
    backBtn.classList.remove("hidden");
  });


  backBtn.addEventListener("click", () => {
    fileInput.value = ""; // Clear the file input

    avatarGrid.classList.remove("hidden");
    previewEl.classList.add("hidden");
    backBtn.classList.add("hidden");

  });
}


//   return `
//     <div class="flex items-center justify-center relative min-h-screen w-full">
//     <div class="absolute  w-[355px] h-[280px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[350px] left-[420px]"></div>
//     <div class="absolute  w-[265px] h-[300px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[400px] left-[990px]"></div>

//     <div class="relative h-[500px] w-[550px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ">
//       <form action="">
//         <h2
//             class="text-white text-center font-glitch text-[1.6em] leading-[35px] tracking-[1px] mt-[5px] mb-[20px]">
//           Choose your avatar
//         </h2>

//         <div class="grid grid-cols-4 gap-6 mb-6" id="avatar-grid">
//           <div class="avatar">
//             <img src="/images/blue-boy.svg" alt="Avatar 1" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/green-girl.svg" alt="Avatar 2" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/white_boy22.svg" alt="Avatar 3" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/dark-girl.svg" alt="Avatar 4" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/pink-girl.svg" alt="Avatar 5" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/white-boy.svg" alt="Avatar 6" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/purple-girl.svg" alt="Avatar 7" class="avatar-img" />
//           </div>
//           <div class="avatar">
//             <img src="/images/red-boy.svg" alt="Avatar 8" class="avatar-img" />
//           </div>
//         </div>
        
//         <div id="upload-section" class="flex flex-col items-center mb-16">
//           <label
//             for="avatarUpload"
//             class="cursor-pointer text-cyan-400 hover:text-cyan-300 transition"
//           >
//             + Upload your own avatar
//           </label>
//           <input type="file" id="avatarUpload" accept="image/*" class="hidden" />
//         </div>

//         <div id="preview-avatar" class="mx-auto"></div>

//         <button
//           id="back-to-avatars"
//           class="hidden mt-3 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full transition"
//         >
//           Back to default avatars
//         </button>


//         <button type="submit" id="sign"
//           class="flex w-[45%] h-[43px] font-glitch items-center justify-center ml-[130px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.4em] tracking-[2px] px-[20px] py-[17px] rounded-[50px] cursor-pointer mt-14 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   </div>
//   `;
// }

