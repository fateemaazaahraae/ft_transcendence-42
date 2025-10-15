export default function Chat() {
  return `
  <div class="flex items-center justify-center text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">

    <!-- Sidebar -->
    <aside
      class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
       bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
       flex justify-around md:justify-normal items-center py-3 md:py-0
       md:bg-transparent md:backdrop-blur-0 z-50">

      <i class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      <i class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>

      <i class="fa-solid fa-user-group  text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
      
      <div class="md:w-[40px] md:h-[40px] w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
        <i class="fa-solid fa-comments text-black text-[18px]"></i>
      </div>

      <i class="fa-solid fa-gear text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
    </aside>
  
  <!-- chat side -->


 <div class="ml-[60px] h-screen w-screen flex items-center justify-center">
    <div class="w-[700px] h-[500px] shadow-lg flex gap-4 overflow-hidden text-white">

      <!-- Sidebar: Chat Profiles -->
      <div class="w-1/2.5 bg-primary/60 rounded-xl border-r border-blue p-4 overflow-y-auto">
      
       <div class="relative ">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-primary focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search ..." required />
    </div>
    
      <div class="space-y-4">
          <div class="flex items-center gap-4 cursor-pointer hover:bg-blue-600 p-2 rounded">
            <div class="w-10 h-10 bg rounded-full flex items-center justify-center text-black font-bold">
            <img src="../images/green-girl.svg" class="w-16 h-16 rounded-full right-">
            </div>
            <div>
              <p class="font-medium text-secondary ">Alice</p>
              <p class="text-sm text-gray-200">Hey, how are you?</p>
            </div>
          </div>
          <div class="flex items-center gap-4 cursor-pointer hover:bg-blue-600 p-2 rounded">
            <div class="w-10 h-10 bg rounded-full flex items-center justify-center text-black font-bold">
            <img src="../images/white-boy.svg" class="w-16 h-16 rounded-full right-">
            </div>
            <div>
              <p class="font-medium text-secondary ">Bob</p>
              <p class="text-sm text-gray-200">Let's meet tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Window -->
      <div class="flex-1 rounded-xl flex flex-col border ">

        <!-- Chat Header -->
        <div class="flex items-center gap-4 p-4 border-b border-gray-700 bg-primary/80">
          <div class="w-16 h-16 bg-blue rounded-full flex items-center justify-center text-black font-bold">
          <img src="../images/green-girl.svg" class="w-16 h-16 rounded-full right-">
          </div>
            <div>
              <p class="font-medium">Alice</p>
              <p class="text-sm text-gray-200">Online</p>
              
            </div>
          </div>

        <!-- Messages -->
        <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-primary/60">
          <div class="bg-blue text-black p-3 rounded-lg w-fit max-w-[70%]">Hi Bob, how are you?</div>
          <div class="bg-blue text-white p-3 rounded-lg w-fit max-w-[70%] self-end ml-auto">Hey Alice! I'm doing great, thanks!</div>
          <div class="bg-blue text-black p-3 rounded-lg w-fit max-w-[70%]">Want to catch up later?</div>
        </div>

        <!-- Message Input -->
          <div class="relative " >
            <div class="p-4 bg-primary/60">
              <div class="relative ">
                <!-- Search Icon Inside -->
                <i class="w-4 h-4 fa-regular fa-paper-plane text-secondary absolute right-3 top-1/2 -translate-y-1/2"></i>
                <i class="fa-solid fa-plus text-secondary absolute left-3 top-1/2 -translate-y-1/2" ></i>
                <i class="fa-solid fa-table-tennis-paddle-ball text-secondary absolute left-9 top-1/2 -translate-y-1/2""></i>
              <!-- <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>-->
                
                <!-- Input with padding for icon -->
                <input 
                  type="text" 
                  placeholder="       Type a message..." 
                  class="w-full pl-10 pr-4 py-2 rounded-full bg-primary text-white placeholder-white focus:outline-none">
              </div>
            </div>
        </div>
   </div>
    </div>
  </div>
  </div>
  `;
}