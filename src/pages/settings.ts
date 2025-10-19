export default function Settings() {
  const user = {
    firstName: "Fatima-zahrae",
    lastName: "Bazaz",
    userName: "fateemaazaahrae",
    email: "fateemaazaahrae@example.com",
    gender: "Female",
    age: 25,
    profileImage: "../../images/pink-girl.svg"
  }

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
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 max-w-[1400px] mx-auto lg:items-center">

      <!-- Profile Image -->
      <div class="flex flex-col md:justify-start gap-4 w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] mx-auto">
        <div class="relative">
          <img src="${user.profileImage}" class="w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full border-2 border-primary/40 object-cover">
          <i class="fa-solid fa-pen-to-square absolute bottom-6 right-4 md:bottom-9 md:right-6 lg:bottom-16 text-[20px] text-primary/90 cursor-pointer"></i>
        </div>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-12 md:px-20">
        <section>
          <h2 class="text-[22px] font-bold mb-6">Information</h2>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-[12px] font-medium mb-2">First Name</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.firstName}" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Last Name</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.lastName}" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Username</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.userName}" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Email</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.email}" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Gender</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.gender}" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">Age</label>
              <input type="text" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px] focus:outline-none focus:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" value="${user.age}" />
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-[22px] font-bold mb-6">Change Password</h2>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-[12px] font-medium mb-2">Current Password</label>
              <input type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px]" placeholder="Enter current password" />
            </div>
            <div>
              <label class="block text-[12px] font-medium mb-2">New Password</label>
              <input type="password" class="w-full bg-black drop-shadow-cyan rounded-[15px] px-4 py-2 font-sansroboto text-[14px]" placeholder="Enter new password" />
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
