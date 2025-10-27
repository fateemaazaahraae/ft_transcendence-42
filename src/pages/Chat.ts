//working on online status && input chat modification &&
// closing chat page && clean list &&  contact list scroll
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
    <div class="w-[70%] h-[600px] shadow-lg flex gap-4 overflow-hidden text-white">

      <!-- Sidebar: Chat Profiles -->
      <div class="w-1/2.5 bg-primary/60 rounded-xl  border-blue p-4 ">
      
       <div class="relative ">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
   
          <input
            type="search"
            id="default-search"
            class="block bg-primary/80 w-full h-[35px] px-4 ps-9 text-sm text-white rounded-2xl border-none focus:outline-none"
            placeholder="Search ..."
            required
          />

        </div>
       
    
      <div class="space-y-4 mt-3 mb-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          <div class="   scroll flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
            <div class="w-16 h-8 bg rounded-full flex items-center justify-center text-black font-bold">
            <img src="../images/green-girl.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
            </div>
            <div>
              <p class="font-medium text-secondary ">Bouchra</p>
              <p class="text-sm text-gray-200">Hey, how are you?</p>
            </div>
          </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8 bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
            <div class="flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded">
                <div class="w-16 h-8  bg rounded-full flex items-center justify-center text-black font-bold">
                <img src="../images/white-boy.svg" class="w-12 h-12 object-cover border border-primary rounded-full right-">
                </div>
              <div>
                <p class="font-medium text-secondary ">Boy</p>
                <p class="text-sm text-gray-200">Let's meet tomorrow</p>
              </div>
            </div>
    </div>
      </div>

      <!-- Main Chat Window -->
      <div id="chatContainer" class="flex-1 rounded-xl flex flex-col ">
          <!--<i class="fa-solid fa-ellipsis-vertical  text-secondary absolute right-3 top-1/2 -translate-y-1/2"></i>-->

        <!-- Chat Header -->
        <div class="relative flex items-center justify-between p-3 rounded-t-xl bg-primary/80">
        <div class="flex items-center gap-3">
          <img src="../images/green-girl.svg" class="w-12 h-12 object-cover border border-primary rounded-full">
          <div>
            <p class="font-medium">Bouchra</p>
            <p class="text-sm text-gray-200">Online</p>
          </div>
        </div>
        
        <!-- Right Side: Ellipsis Icon -->
        <button id="menuToggle" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/20 transition-all">
        <i class="fa-solid fa-ellipsis-vertical text-secondary"></i>
        </button>

      <div id="dropdownMenu" class="hidden absolute right-3 top-12 bg-#35C6DD backdrop-blur-md rounded-lg shadow-lg py-2 w-40 z-50">
  <button class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
    <i class="fas fa-circle-info"></i>
    Contact Info
  </button>
  <button class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
    <i class="fa-regular fa-heart "></i>
    Add To Favorites
  </button>
  <button id="closeChat" class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
    <i class="fa-regular fa-times-circle"></i>
    Close Chat
  </button>
  <button class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
    <i class="fa fa-ban"></i>
    Block User
  </button>
</div>
      </div>


        <!-- Messages -->
        <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-primary/60">
          <div class="flex justify-items ">
          <img src="../images/green-girl.svg" class="w-14 h-14 object-cover mr-3 border border-primary rounded-full">
        <div class="bg-primary/65 text-white  p-3 rounded-3xl w-fit  max-w-[60%]">
           Hi Salma, how are you?
           </div>
           </div>

           <div class="flex items-end gap-3 ml-auto w-fit">
           <div class="bg-primary/65 text-white p-3 rounded-3xl w-fit  max-w-[70%]">Hey Bouchra! I'm doing great, thanks!</div>
           <img src="../images/green-girl.svg" class="w-14 h-14  object-cover border border-primary rounded-full ">
           </div>
           
           <div class="flex justify-items ">
          <img src="../images/green-girl.svg" class="w-14 h-14 object-cover mr-3 border border-primary rounded-full ">
          <div class="bg-primary/65 text-white p-3 rounded-3xl w-fit max-w-[70%]">Want to catch up later?</div>
        </div>
        </div>

        <!-- Message Input -->
          <div class="relative "  >
            <div class="p-4 bg-primary/60 rounded-b-xl">
              <div class="relative ">
                
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
                  class="w-full pl-10 pr-4 py-2 pr-10 rounded-full bg-primary/65 text-white placeholder-white focus:outline-none">
              </div>
            </div>
        </div>
        
   </div>
    </div>
  </div>
  </div>
  `;
}

export function OptionsChat()
{
const menuToggle=document.getElementById("menuToggle");
const dropdownMenu=document.getElementById("dropdownMenu");

menuToggle?.addEventListener("click",()=>
{
  dropdownMenu?.classList.toggle("hidden");
});

document.addEventListener("click",(e)=>{
  const target = e.target as Node;
  // const target = e.target as HTMLElement;

  if(!menuToggle?.contains(target) && !dropdownMenu?.contains(target))
  {
    dropdownMenu?.classList.add("hidden");
  }
});
}

export function closeChat()
{
  const closebutton=document.getElementById("closeChat");
  const chatDiv = document.getElementById("chatContainer");
  closebutton?.addEventListener("click",()=>
  {
   if(chatDiv)
    {
      chatDiv.innerHTML=`
        
        <div class="flex-1  p-4 justify-items-center space-y-4 rounded-2xl overflow-y-auto bg-primary/60">

          <h1 class=" "> Ping Pong Chat </h1>
          </div>
        
      `;
    } 
    const dropdown = document.getElementById("dropdownMenu");
    dropdown?.classList.add("hidden");
  });
  

}

