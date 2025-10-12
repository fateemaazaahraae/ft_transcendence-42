export default function Settings() {
  return `
  <div class="min-h-screen text-white font-roboto px-6 md:px-20 py-10 relative pb-[90px] md:pb-10 overflow-y-auto">

    <!-- Sidebar -->
    <aside
        class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
         bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
         flex justify-around md:justify-normal items-center py-3 md:py-0
         md:bg-transparent md:backdrop-blur-0 z-50">

      <i class="fa-solid fa-house text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-trophy text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-user-group text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-comments text-[22px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <div class="md:w-[40px] md:h-[40px] sm:w-[35px] sm:h-[35px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-gear text-black text-[18px]"></i>
      </div>
    </aside>


    <!-- Controls Icons -->
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

    <!-- Title -->
    <h1 class="text-4xl md:text-5xl font-glitch text-center mt-40 mb-20">Settings</h1>

    <!-- Content Wrapper -->
    <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 max-w-[1400px] mx-auto items-center px-6">

      <!-- Profile Image -->
      <div class="flex flex-col items-center justify-start gap-4 w-[330px] h-[330px] mx-auto">
        <div class="relative">
          <img src="../../images/pink-girl.svg" class="sm:w-[250px] sm:h-[250px] md:w-[330px] md:h-[330px] rounded-full border-2 border-primary/40 object-cover">
          <i class="fa-solid fa-pen-to-square absolute md:bottom-12 md:right-7 sm:bottom-9 sm:right-6 text-[20px] text-primary/90 cursor-pointer"></i>
        </div>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-12 sm:px-20">
        <section>
          <h2 class="text-[22px] font-bold mb-6">Information</h2>

          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label class="block text-[12px] mb-2">First Name</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="Fatima-zahrae" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">Last Name</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="Bazaz" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">Username</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="fateemaazaahrae" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">Email</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="fatimazahraebazaz1@gmail.com" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">Gender</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="Female" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">Age</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" value="25" />
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-[22px] font-bold mb-6">Change Password</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <label class="block text-[12px] mb-2">Current Password</label>
              <input type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" placeholder="Enter current password" />
            </div>
            <div>
              <label class="block text-[12px] mb-2">New Password</label>
              <input type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2" placeholder="Enter new password" />
            </div>
          </div>
        </section>

        <button type="submit" class="w-[200px] h-[50px] bg-black drop-shadow-cyan rounded-[25px] text-white font-bold hover:bg-primary/60 hover:text-black transition-colors">
          Save Changes
        </button>
      </form>

    </div>
  </div>
`;
}
