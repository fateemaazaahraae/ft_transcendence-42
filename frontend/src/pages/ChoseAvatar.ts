import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";
import { requiredAuth } from "../utils/authGuard.ts";

export default function ChoseAvatar() {
  if (!requiredAuth())
      return "";
  return `<div class="min-h-screen w-full flex items-center justify-center gap-[8px] relative pt-[3%]">

    <div class="relative inset-0 items-center h-[650px] md:h-[750px] w-full md:w-[820px] pt-[75px] md:pt-[130px] rounded-[50px] overflow-hidden">

        <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[365px] md:h-[240px] bg-[#35C6DDE5] left-[calc(50%-175px)] md:left-[calc(50%-320px)]  top-[11%] md:top-[20%] -rotate-[20deg] md:rotate-[63deg]"></div>
        <div class="absolute rounded-full blur-[55px] opacity-110 w-[100px] h-[240px] md:w-[300px] md:h-[350px] bg-[#D02EA48A] right-[calc(50%-140px)] md:left-[calc(50%-1px)] md:bottom-[60%] top-[52%] md:top-[48%] -rotate-[35deg] -md:rotate-[50deg]"></div>

        <div class="relative inset-0 m-auto w-[320px] md:w-[480px] lg:w-[480px] h-[410px] md:h-[450px] px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[15px]">
          <form action="">
            <h2
                class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[55px] md:mb-[25px]">
              Choose your avatar
            </h2>
            <div class="grid grid-cols-4 md:gap-6 mb-6 justify-center place-items-center" id="avatar-grid">
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer mb-[40px] md:mb-0 transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="blue-boy.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer mb-[40px] md:mb-0 transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="green-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer mb-[40px] md:mb-0 transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/white-boy2.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer mb-[40px] md:mb-0 transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/dark-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/pink-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/white-boy.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/purple-girl.svg" class="w-full h-full object-cover"/>
              </div>
              <div class="relative w-[55px] h-[55px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-[1px] md:border-[3px] border-[#35C6DD] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-[1.2] md:hover:scale-[1.3] data-[selected=true]:border-[#D934B0]"
              data-selected="false">
                <img src="/red-boy.svg" class="w-full h-full object-cover"/>
              </div>
            </div>

            <button id="back-to-avatars"
              class="hidden mt-3 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 mb-[10px] rounded-full transition">
              <i class="fa-solid fa-arrow-left"></i>
            </button>

            <div id="preview-avatar" class="mx-auto"></div> <!-- I added here the height variable -->

            <div id="upload-section" class="flex flex-col items-center">
              <label for="avatarUpload"
              class="cursor-pointer text-cyan-400 hover:text-cyan-300 transition">
              + Upload Avatar
              </label>
              <input type="file" id="avatarUpload" accept="image/*" class="hidden" />
            </div>

            <button type="submit" id="sign"
              class="flex w-[45%] h-[37px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[20px] rounded-[50px] cursor-pointer mt-5 md:mt-6 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
              Sign Up
            </button>
          </form>
        </div>
        </div>
  </div>
  `;
}


export function ChoseAvatarEventListener() {

  const sign = document.getElementById("sign");
  sign?.addEventListener("click", async(e) => {
    e.preventDefault();

    let avatarToSend = null;
    const fileInput = document.getElementById("avatarUpload") as HTMLInputElement | null;

if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
      avatarToSend = await convertToBase64(file);
    }
    else {
      const selected = Array.from(document.querySelectorAll<HTMLDivElement>("#avatar-grid div"))
    .find(div => div.dataset.selected === "true");

      if (selected)
        avatarToSend = selected.querySelector("img")?.getAttribute("src");
    }

    if (!avatarToSend) {
      showAlert("Please choose an avatar");
      return;
    }

    try {
const token = localStorage.getItem("token");
if (!token) {
  showAlert("You must be logged in to choose an avatar");
  navigate("/login");
  return;
}

const res = await fetch("http://localhost:3000/user/avatar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // ✅ send JWT
  },
  body: JSON.stringify({ profileImage: avatarToSend }),
});


      const data = await res.json();

      if (!res.ok) {
        showAlert(data.error || "Could not save avatar");
        return;
      }

      navigate("/login");
    }
    catch (err) {
      showAlert("Network error while saving avatar");
    }
  });

  function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}


  // SELECT AVATAR WITH BORDER COLOR
  const avatarGrid = document.getElementById("avatar-grid");
  if (!avatarGrid) return;

  const avatars = Array.from(avatarGrid.querySelectorAll("div"));
  avatars.forEach((avatar) => {
    avatar.addEventListener("click", () => {
      avatars.forEach((a) => (a.dataset.selected = "false"));
      avatar.dataset.selected = "true";
    });
  });

  // UPLOAD PREVIEW
  const fileInput = document.getElementById("avatarUpload") as HTMLInputElement | null;;
  const previewEl = document.getElementById("preview-avatar");
  const backBtn = document.getElementById("back-to-avatars");

  if (!fileInput || !previewEl || !backBtn) return;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    previewEl.innerHTML = `
      <img src="${url}" class="w-[120px] h-[120px] m-auto rounded-full border-[3px] border-[#D934B0] object-cover" />
    `;

    avatarGrid.classList.add("hidden");
    previewEl.classList.remove("hidden");
    backBtn.classList.remove("hidden");
  });

  backBtn.addEventListener("click", () => {
    fileInput.value = "";
    avatarGrid.classList.remove("hidden");
    previewEl.classList.add("hidden");
    backBtn.classList.add("hidden");
  });
}
