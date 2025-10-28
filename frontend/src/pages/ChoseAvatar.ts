import { navigate } from "../main.ts";

export default function ChoseAvatar() {
  return `
    <div class="flex items-center justify-center relative min-h-screen w-full">
    <div class="absolute  w-[355px] h-[280px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[350px] left-[420px]"></div>
    <div class="absolute  w-[265px] h-[300px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[400px] left-[990px]"></div>

    <div class="relative h-[500px] w-[550px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ">
      <form action="">
        <h2
            class="text-white text-center font-glitch text-[1.6em] leading-[35px] tracking-[1px] mt-[5px] mb-[20px]">
          Choose your avatar
        </h2>

        <div class="grid grid-cols-4 gap-6 mb-6" id="avatar-grid">
          <div class="avatar">
<<<<<<< HEAD:src/pages/ChoseAvatar.ts
            <img src="/images/blue-boy.svg" alt="Avatar 1" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/green-girl.svg" alt="Avatar 2" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/white_boy22.svg" alt="Avatar 3" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/dark-girl.svg" alt="Avatar 4" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/pink-girl.svg" alt="Avatar 5" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/white-boy.svg" alt="Avatar 6" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/purple-girl.svg" alt="Avatar 7" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/images/red-boy.svg" alt="Avatar 8" class="avatar-img" />
=======
            <img src="/public/blue-boy.svg" alt="Avatar 1" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/green-girl.svg" alt="Avatar 2" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/white_boy22.svg" alt="Avatar 3" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/dark-girl.svg" alt="Avatar 4" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/pink-girl.svg" alt="Avatar 5" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/white-boy.svg" alt="Avatar 6" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/purple-girl.svg" alt="Avatar 7" class="avatar-img" />
          </div>
          <div class="avatar">
            <img src="/public/red-boy.svg" alt="Avatar 8" class="avatar-img" />
>>>>>>> b0a02b0fc80573ebe4589c8905a7432f26ebe29d:frontend/src/pages/ChoseAvatar.ts
          </div>
        </div>
        
        <div id="upload-section" class="flex flex-col items-center mb-16">
          <label
            for="avatarUpload"
            class="cursor-pointer text-cyan-400 hover:text-cyan-300 transition"
          >
            + Upload your own avatar
          </label>
          <input type="file" id="avatarUpload" accept="image/*" class="hidden" />
        </div>

        <div id="preview-avatar" class="mx-auto"></div>

        <button
          id="back-to-avatars"
          class="hidden mt-3 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full transition"
        >
          Back to default avatars
        </button>


        <button type="submit" id="sign"
          class="flex w-[45%] h-[43px] font-glitch items-center justify-center ml-[130px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.4em] tracking-[2px] px-[20px] py-[17px] rounded-[50px] cursor-pointer mt-14 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
          Sign Up
        </button>
      </form>
    </div>
  </div>
  `;
}

export function ChoseAvatarEventListener(){
    const sign= document.getElementById("sign");
    sign?.addEventListener("click", () =>{navigate("/home");
    }); 
}
