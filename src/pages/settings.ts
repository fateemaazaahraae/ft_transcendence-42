export default function Settings() {
    return `
  <div class="fixed bottom-[250px] left-6 flex flex-col items-center gap-10 z-50">
      <i class="fa-solid fa-house hover:text-secondary text-[22px] text-primary cursor-pointer"></i>
      <i class="fa-solid fa-user hover:text-secondary text-[22px] text-primary cursor-pointer"></i>
      <i class="fa-solid fa-trophy hover:text-secondary text-[22px] text-primary cursor-pointer"></i>
      <i class="fa-solid fa-user-group hover:text-secondary text-[22px] text-primary cursor-pointer"></i>
      <i class="fa-solid fa-comments hover:text-secondary text-[22px] text-primary cursor-pointer"></i>

      <div class="flex items-center justify-center w-[40px] h-[40px] bg-primary rounded-full">
          <i class="fa-solid fa-gear text-[18px] text-black cursor-pointer"></i>
      </div>

    </div>

    <div class="fixed left-[1650px] top-[40px] flex flex-row items-center gap-5 z-50">

      <!-- Language icon -->
      <div class="relative group">
        <button class="flex items-center gap-2 text-primary cursor-pointer hover:text-secondary">
          <i class="fa-solid fa-chevron-down text-xs cursor-pointer"></i>
          En
        </button>

        <ul class="absolute mt-1 rounded-md hidden group-hover:block transition-all duration-200 ease-in-out">
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">En</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">Fr</li>
          <li class="px-4 py-2 hover:text-secondary cursor-pointer">Ar</li>
        </ul>
      </div>

      <i class="fa-regular fa-bell text-primary cursor-pointer hover:text-secondary"></i>
      <i class="fa-solid fa-arrow-right-from-bracket text-primary cursor-pointer hover:text-secondary"></i>
  </div>

  <h1 id="leader" class="text-white font-glitch text-5xl tracking-[4px] fixed top-[120px] left-1/2 -translate-x-1/2 z-50" >Settings</h1>

  <!-- Information section -->
  <div class="font-roboto text-[25px] font-bold text-white fixed top-[250px] left-[550px] z-50">Information</div>
  <form>
  
      <!-- firstname -->
      <div class="flex flex-row gap-[100px] fixed top-[310px] left-1/2 -translate-x-1/2">
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="firstname">First Name</label>
          <input id="firstname" type="text" name="firstname" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required value="Fatima-zahrae" >
        </div>

        <!-- lastname -->
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="lastname">Last Name</label>
          <input id="lastname" type="text" name="lastname" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required value="Bazaz">
        </div>
      </div>

      <!-- username -->
      <div class="flex flex-row gap-[100px] fixed top-[410px] left-1/2 -translate-x-1/2">
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="username">Username</label>
          <input id="username" type="text" name="username" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required value="fateemaazaahrae">
        </div>

        <!-- email -->
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="email">E-mail</label>
          <input id="email" type="text" name="email" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required value="fatimazahraebazaz1@gmail.com">
        </div>
      </div>

      <!-- gender -->
      <div class="flex flex-row gap-[100px] fixed top-[510px] left-1/2 -translate-x-1/2">
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="gender">Gender</label>
          <input id="gender" type="text" name="gender" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required value="Female">
        </div>

        <!-- age -->
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="age">Age</label>
          <input id="age" type="text" name="age" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/80" required required value="25">
        </div>
      </div>

  <!-- password section -->
  <div class="font-roboto text-[25px] font-bold text-white fixed top-[640px] left-[550px] z-50">Change password</div>
      <!-- current password -->
      <div class="flex flex-row gap-[100px] fixed top-[700px] left-1/2 -translate-x-1/2">
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="current-password">Current Password</label>
          <input id="current-password" type="password" name="current-password" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/60" placeholder="Enter your current password">
        </div>

        <!-- newpassword -->
        <div class="mb-4">
          <label class="block text-white text-[12px] font-roboto font-medium ml-2 mb-2" for="new-password">New Password</label>
          <input id="new-password" type="password" name="new-password" class="w-[350px] h-[45px] bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 text-[15px] placeholder-white/60" placeholder="Enter New password">
        </div>
      </div>
    <button type="submit" class="w-[200px] h-[50px] bg-black drop-shadow-cyan rounded-[25px] text-white font-roboto font-bold text-[18px] fixed top-[850px] left-[1550px] hover:bg-primary hover:text-black transition-colors duration-300 ease-in-out">Save Changes</button>
  </form>
`;
}