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


  <!-- Chat Layout -->
 <div class="w-[700px] h-[500px] bg-primary rounded-xl shadow-lg flex gap-4 overflow-hidden font-roboto text-white">

  <!-- Sidebar: Chat Profiles -->
  
  <div class="w-1/3 md:w-1/2 lg:w-1/4 bg-blue border-r border-blue p-4 overflow-y-auto">
    <h2 class="text-xl font-semibold mb-4">Chats</h2>
    <div class="space-y-4">
      <div class="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">A</div>
        <div>
          <p class="font-medium">Alice</p>
          <p class="text-sm text-gray-400">Hey, how are you?</p>
        </div>
      </div>
      <div class="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">B</div>
        <div>
          <p class="font-medium">Bob</p>
          <p class="text-sm text-gray-400">Let's meet tomorrow</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Chat Window -->
  <div class="flex-1 flex flex-col justify-between bg-blue">
    
    <!-- Chat Header -->
    <div class="flex items-center gap-4 p-4 border-b border-gray-700 bg-blue">
      <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">A</div>
      <div>
        <p class="font-medium">Alice</p>
        <p class="text-sm text-gray-400">Online</p>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 p-4 space-y-4 overflow-y-auto">
      <div class="bg-primary text-black p-3 rounded-lg w-fit max-w-[70%]">Hi Bob, how are you?</div>
      <div class="bg-gray-700 text-white p-3 rounded-lg w-fit max-w-[70%] self-end ml-auto">Hey Alice! I'm doing great, thanks!</div>
      <div class="bg-primary text-black p-3 rounded-lg w-fit max-w-[70%]">Want to catch up later?</div>
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
      <input type="text" placeholder="Type a message..." class="flex-1 p-2 rounded-full bg-gray-700 text-white focus:outline-none">
      <button class="bg-primary text-black px-4 py-2 rounded-full">Send</button>
    </div>
  </div>
</div>
    
  </div>
  `;
}