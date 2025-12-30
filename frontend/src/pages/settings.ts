import { getSavedLang } from "../i18n";
import { translateMsg } from "../i18n/translateBack";
import { navigate } from "../main";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard";

export  default async function Settings() {
  if (!requiredAuth())
    return "";

  const currentLang = (await getSavedLang()).toUpperCase();
  return `
  <div class="min-h-screen text-white font-roboto px-6 md:px-20 py-10 relative pb-[90px] overflow-y-auto">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/friends" class="fa-solid fa-user-group text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i data-path="/chat" class="fa-solid fa-comments text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div class="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
        <i class="fa-solid fa-gear text-black text-[18px]"></i>
      </div>
    </aside>


    <!-- Controls Icons -->
    <div class="absolute top-10 right-[5%] flex items-center gap-4">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 left-3"></i>
        <input type="text" placeholder="Search" class="search-input w-[180px] md:w-[280px] font-roboto px-10 py-2 rounded-full text-[12px] focus:outline-none bg-black border-[2px] border-primary/70">
        <div class="search-results absolute top-full left-0 w-full h-auto backdrop-blur-md mt-1 hidden z-[9000] rounded-xl"></div>
      </div>
      <div class="arrow relative group">
        <button id="currentLang" class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          ${currentLang}
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Title -->
    <h1 data-i18n="settings" class="text-4xl md:text-5xl font-glitch text-center mt-20 mb-14"></h1>

    <!-- Content Wrapper -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] max-w-[1600px] mx-auto lg:items-center">

      <!-- Profile Image -->
      <div class="flex flex-col md:justify-start gap-12 w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] mx-auto">
        <div class="relative">
          <img src="" id="myImg" class="w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full border-2 border-primary/40 object-cover">
          <i class="fa-solid fa-pen-to-square absolute bottom-6 right-4 md:bottom-9 md:right-6 lg:bottom-16 text-[20px] text-primary/90 cursor-pointer"></i>
        </div>
      </div>

      <!-- Form -->
      <form id="settings-form" class="flex flex-col gap-16 md:px-20">
        <section>
          <h2 data-i18n="info" class="text-[22px] font-bold mb-6"></h2>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label data-i18n="firstName" class="block text-[12px] font-medium mb-2"></label>
              <input id="firstName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label data-i18n="lastName" class="block text-[12px] font-medium mb-2"></label>
              <input id="lastName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label data-i18n="userName" class="block text-[12px] font-medium mb-2"></label>
              <input id="userName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label data-i18n="email" class="block text-[12px] font-medium mb-2"></label>
              <input id="email" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label data-i18n="gender" class="block text-[12px] font-medium mb-2"></label>
              <select id="gender" class="w-full px-4 py-2 rounded-[15px] drop-shadow-cyan bg-black font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div>
              <label data-i18n="age" class="block text-[12px] font-medium mb-2"></label>
              <input id="age" type="number" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
          </div>
        </section>

        <!-- Password + 2FA  -->
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-14">

            <!-- Change Password -->
            <div>
              <h2 data-i18n="changePass" class="text-[18px] font-semibold mb-4"></h2>

              <div class="flex flex-col gap-6">
                <div>
                  <label data-i18n="curr" class="block text-[12px] font-medium mb-2"></label>
                  <input id="currentPassword" type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[12px]" placeholder="Enter current password" />
                </div>

                <div>
                  <label data-i18n="new" class="block text-[12px] font-medium mb-2"></label>
                  <input id="newPassword" type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[12px]" placeholder="Enter new password" />
                </div>
              </div>
            </div>

            <!-- 2FA -->
            <div>
              <h2 data-i18n="twoFA" class="text-[18px] font-semibold mb-4"></h2>
              <p data-i18n="FAdesc" class="text-[13px] max-w-[330px] mb-6"></p>
              <button id="2fa-button" class="text-[12px] w-[100px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-bold hover:bg-primary/60 hover:text-black transition-colors"></button>
            </div>

          </div>
        </section>

        <button data-i18n="save" type="submit" class="text-[18px] w-[150px] h-[50px] bg-primary/40 drop-shadow-cyan rounded-[25px] text-black font-bold hover:bg-primary/60 hover:text-black transition-colors"></button>
      </form>

      <div id="avatar-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-50 hidden">
        <div class="bg-black rounded-[20px] p-10 md:p-10 relative flex flex-col items-center w-[90%] max-w-[700px] drop-shadow-cyan">
          <i id="close-avatar-modal" class="fa-solid fa-xmark absolute top-4 right-8 text-primary cursor-pointer text-xl"></i>
          <h2 data-i18n="changeAvt" class="text-white text-center font-glitch text-[30px] mb-10"></h2>
          <div class="grid grid-cols-4 gap-6" id="avatar-grid">
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/pink-girl.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/dark-girl.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/green-girl.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/purple-girl.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/blue-boy.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/red-boy.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/white-boy.svg" class="w-full h-full object-cover" /></div>
            <div class="avatar w-[90px] h-[90px] rounded-full overflow-hidden border-[2px] border-primary hover:scale-[1.05] data-[selected=true]:border-secondary" data-selected="false"><img src="/white-boy2.svg" class="w-full h-full object-cover" /></div>
          </div>
          <div class="flex items-center justify-center mt-7 text-center w-[20px] h-[20px] rounded-full border-[2px] border-primary">
            <label class="cursor-pointer text-cyan-400 hover:text-cyan-300">+
              <input type="file" id="avatarUpload" accept="image/*" name="image" class="hidden" />
            </label>
          </div>
          <button data-i18n="save" id="avatar-submit" class="mt-7 w-[20%] text-white bg-black drop-shadow-cyan font-bold hover:bg-primary/60 hover:text-black transition-colors py-2 rounded-[25px] text-[13px]"></button>
        </div>
      </div>

    </div>
  </div>
`;
}

async function fillSettingsPage()
{
  const userId = localStorage.getItem("userId");
  if (!userId) {
    showAlert("Login first");
    navigate("/login");
  }
  try
  {
    const res = await fetch(`http://localhost:3001/settings/${userId}`);
    const data = await res.json();
    
    // fill page
    (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
    (document.getElementById("firstName") as HTMLInputElement).value = data.firstName || "";
    (document.getElementById("lastName") as HTMLInputElement).value = data.lastName || "";
    (document.getElementById("userName") as HTMLInputElement).value = data.userName || "";
    (document.getElementById("email") as HTMLInputElement).value = data.email || "";
    (document.getElementById("age") as HTMLInputElement).value = data.age?.toString() || "";
    (document.getElementById("gender") as HTMLSelectElement).value = data.gender || "Female";
    const twoFactorButton = document.getElementById("2fa-button") as HTMLButtonElement;
    if (twoFactorButton) {
      twoFactorButton.innerText = data.isTwoFactorEnabled === 1 ? await translateMsg("DISABLE") : await translateMsg("ENABLE");
    }
  }
  catch (err)
  {
    console.log(err);
    showAlert("Error while fetching data: " + err);
  }
}

function handleTwoFactorButton(twoFactorButton: HTMLButtonElement) {
  twoFactorButton.addEventListener("click", async(e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showAlert("Login first");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/2fa`, {
        method: "PUT"
      })
      const data = await res.json();
      const translatedMsg = await translateMsg(data.code);
      if (!res.ok) {
        showAlert("Error: " + translatedMsg);
        return;
      }
      if (twoFactorButton.innerText.trim() === await translateMsg("ENABLE"))
        twoFactorButton.innerText =  await translateMsg("DISABLE");
      else
        twoFactorButton.innerText =  await translateMsg("ENABLE");
      showAlert(translatedMsg, "success");
    }
    catch (err)
    {
      console.error(err);
      showAlert(await translateMsg("NETWORK_ERROR"))
    }
  })
}

export function SettingsEventListner() {
  fillSettingsPage();
  const settingsForm = document.getElementById("settings-form") as HTMLFormElement | null;
  const twoFactorButton = document.getElementById("2fa-button") as HTMLButtonElement;
  if (!twoFactorButton) {
    console.error("2fa button not found in the DOM");
    return;
  }
  else
    handleTwoFactorButton(twoFactorButton);
  if (!settingsForm) {
    console.error("Settings form not found in the DOM");
    return;
  }
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showAlert("Login first");
      navigate("/login");
      return;
    }
    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    const userName = (document.getElementById("userName") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const ageValue = Number((document.getElementById("age") as HTMLInputElement).value);
    const genderValue = (document.getElementById("gender") as HTMLSelectElement).value;
    const currentPassword = (document.getElementById("currentPassword") as HTMLInputElement).value;
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;

    const bodyData: any = {
      firstName,
      lastName,
      userName,
      email,
      age: ageValue,
      gender: genderValue
    }

    if (currentPassword && newPassword)
    {
      bodyData.currentPassword = currentPassword;
      bodyData.newPassword = newPassword;
    }
    try {
      const res = await fetch(`http://localhost:3001/settings/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      const translatedMsg = await translateMsg(data.code);
      if (!res.ok) {
        showAlert("Error: " + translatedMsg);
        return;
      }
      await showAlert(translatedMsg, "success");
      (document.getElementById("currentPassword") as HTMLInputElement).value = "";
      (document.getElementById("newPassword") as HTMLInputElement).value = "";
    }
    catch(err)
    {
      console.error(err);
      showAlert(await translateMsg("NETWORK_ERROR"))
    }
  })

  // images handler
  function setupAvatarModal() {
    const penIcon = document.querySelector(".fa-pen-to-square");
    const modal = document.getElementById("avatar-modal");
    const closeButton = document.getElementById("close-avatar-modal");
    const avatarGrid = document.getElementById("avatar-grid");
    const fileInput = document.getElementById("avatarUpload") as HTMLInputElement;
    const saveButton = document.getElementById("avatar-submit");

    if (!penIcon || !modal || !closeButton || !avatarGrid || !saveButton || !fileInput) return;
    let selectedAvatar: string | null = null;
    // open modal
    penIcon.addEventListener("click", () => {
      modal.classList.add("flex");
      modal.classList.remove("hidden");
    });
    // close modal when clicking the x
    closeButton.addEventListener("click", () => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    });
    // close modal when clicking outside the box
    modal.addEventListener("click", (event) => {
      if (event.target === modal)
      {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      }
    });

    const avatarOptions = document.querySelectorAll(".avatar");
    avatarOptions.forEach((avatar) => {
      avatar.addEventListener("click", () => {
        avatarOptions.forEach(a => a.setAttribute("data-selected", "false"));
        avatar.setAttribute("data-selected", "true");
        const img = avatar.querySelector("img") as HTMLImageElement;
        selectedAvatar = img.getAttribute("src");
      });
    });

    // upload button
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const userId = localStorage.getItem("userId");
      if (!userId) {
          showAlert("Login first");
          navigate("/login");
          return;
      }
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`http://localhost:3000/users/${userId}/upload`, {
            method: "PUT",
            body: formData
        });
        const data = await res.json();
        const translatedMsg = await translateMsg(data.code);
        if (!res.ok) {
            showAlert(translatedMsg);
            return;
        }
        const myImg = document.getElementById("myImg") as HTMLImageElement;
        myImg.src = data.profileImage;
        selectedAvatar = data.profileImage;
        modal.classList.add("hidden");
        showAlert(translatedMsg, "success");
      }
      catch (error) {
        console.error(error);
        showAlert(await translateMsg("NETWORK_ERROR"));
      }
    });

    // sending the image to the backend
    saveButton.addEventListener("click", async () => {
      if (!selectedAvatar)
      {
        const translatedMsg = await translateMsg("CHOOSE_AVATAR");
        showAlert(translatedMsg);
        return;
      }
      const userId = localStorage.getItem("userId");
      try {
        const res = await fetch(`http://localhost:3000/users/${userId}/avatar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImage: selectedAvatar })
        });
        const data = await res.json();
        const translatedMsg = await translateMsg(data.code);
        if (!res.ok) {
          showAlert("Error updating avatar");
          return;
        }
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        (document.getElementById("myImg") as HTMLImageElement).src = data.profileImage || "";
        showAlert(translatedMsg, "success");
      }
      catch (err) {
        console.error(err);
        showAlert(await translateMsg("NETWORK_ERROR"))
      }
    });
  }
  setupAvatarModal();
}
