import { navigate } from "../main";
import { showAlert } from "../utils/alert";
import { requiredAuth } from "../utils/authGuard";

export default function Settings() {
  if (!requiredAuth())
    return "";
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
      <div class="arrow relative group">
        <button class="flex items-center gap-2 text-primary font-roboto hover:text-secondary transition-all duration-400 ease-in-out">
          <i class="fa-solid fa-chevron-down text-xs"></i>
          En
        </button>
      </div>
      <i class="fa-regular fa-bell text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
      <i id="logout-icon" class="fa-solid fa-arrow-right-from-bracket text-primary hover:text-secondary cursor-pointer transition-all duration-400 ease-in-out"></i>
    </div>

    <!-- Title -->
    <h1 class="text-4xl md:text-5xl font-glitch text-center mt-20 mb-14">Settings</h1>

    <!-- Content Wrapper -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] max-w-[1600px] mx-auto lg:items-center">

      <!-- Profile Image -->
      <div class="flex flex-col md:justify-start gap-12 w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] mx-auto">
        <div class="relative">
          <img src="/pink-girl.svg" class="w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full border-2 border-primary/40 object-cover">
          <i class="fa-solid fa-pen-to-square absolute bottom-6 right-4 md:bottom-9 md:right-6 lg:bottom-16 text-[20px] text-primary/90 cursor-pointer"></i>
        </div>
      </div>

      <!-- Form -->
      <form id="settings-form" class="flex flex-col gap-16 md:px-20">
        <section>
          <h2 class="text-[22px] font-bold mb-6">Information</h2>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-[12px] font-medium mb-2">First Name</label>
              <input id="firstName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="=" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Last Name</label>
              <input id="lastName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Username</label>
              <input id="userName" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Email</label>
              <input id="email" type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Gender</label>
              <select id="gender" class="w-full px-4 py-2 rounded-[15px] drop-shadow-cyan bg-black font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Age</label>
              <input id="age" type="number" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[12px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="" />
            </div>
          </div>
        </section>

        <!-- Password + 2FA  -->
        <section>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-14">

            <!-- Change Password -->
            <div>
              <h2 class="text-[18px] font-semibold mb-4">Change Password</h2>

              <div class="flex flex-col gap-6">
                <div>
                  <label class="block text-[12px] font-medium mb-2">Current Password</label>
                  <input id="currentPassword" type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[12px]" placeholder="Enter current password" />
                </div>

                <div>
                  <label class="block text-[12px] font-medium mb-2">New Password</label>
                  <input id="newPassword" type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[12px]" placeholder="Enter new password" />
                </div>
              </div>
            </div>

            <!-- 2FA -->
            <div>
              <h2 class="text-[18px] font-semibold mb-4">Two-Factor Authentication</h2>
              <p class="text-[13px] max-w-[330px] mb-6"> Add an extra layer of protection to your account by requiring a verification code before access. </p>
              <button class="text-[12px] w-[100px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-bold hover:bg-primary/60 hover:text-black transition-colors">
                Enable
              </button>
            </div>

          </div>
        </section>

        <button type="submit" class="text-[15px] w-[150px] h-[50px] bg-primary/40 drop-shadow-cyan rounded-[25px] text-black font-bold hover:bg-primary/60 hover:text-black transition-colors">
          Save Changes
        </button>
      </form>



    </div>
  </div>
`;
}

async function fillSettingsPage()
{
  const userId = localStorage.getItem("userId");
  console.log("id --------- " + userId)
  if (!userId) {
    showAlert("Login first");
    navigate("/login");
  }
  try
  {
    const res = await fetch(`http://localhost:3001/settings/${userId}`);
    const data = await res.json();
    
    // fill page
    (document.getElementById("firstName") as HTMLInputElement).value = data.firstName || "";
    (document.getElementById("lastName") as HTMLInputElement).value = data.lastName || "";
    (document.getElementById("userName") as HTMLInputElement).value = data.userName || "";
    (document.getElementById("email") as HTMLInputElement).value = data.email || "";
    (document.getElementById("age") as HTMLInputElement).value = data.age?.toString() || "";
    (document.getElementById("gender") as HTMLSelectElement).value = data.gender || "Female";
  }
  catch (err)
  {
    console.log(err);
    showAlert("Error while fetching data: " + err);
  }
}

export function SettingsEventListner() {
  // showAlert("settings rendered", "success")
  fillSettingsPage();
  const settingsForm = document.getElementById("settings-form") as HTMLFormElement | null;
  if (!settingsForm)
  {
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
      if (!res.ok) {
        showAlert("Error: " + data.error);
        return;
      }
      await showAlert("Profile Updating successfully", "success");
      (document.getElementById("currentPassword") as HTMLInputElement).value = "";
      (document.getElementById("newPassword") as HTMLInputElement).value = "";
    }
    catch(err)
    {
      console.error(err);
      showAlert("Netword error while updating settings")
    }
  })
}
