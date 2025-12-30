import { ChatEventListener } from "./chatEventListener.ts";
import { getSavedLang } from "../i18n/index.ts";

export default async function Chat() {
  // ChatEventListener is invoked by the router `setUp` after the page is rendered.
    const contactUsername = '';
    const currentLang = (await getSavedLang()).toUpperCase();
    
    return `
    <div class="h-screen overflow-hidden flex items-center justify-center text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">
        <aside class="fixed md:left-6 md:bottom-[40%] md:flex-col md:gap-8
           bottom-0 left-0 w-full bg-black/40 backdrop-blur-md md:w-auto
           flex justify-around md:justify-normal items-center py-3 md:py-0
           md:bg-transparent md:backdrop-blur-0 z-50">
          <i data-path="/home" class="fa-solid fa-house text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out  "></i>
          <i data-path="/leaderboard" class="fa-solid fa-trophy text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
          <i data-path="/friends" class="fa-solid fa-user-group  text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
          <div data-path="/chat" class="md:w-[40px] md:h-[40px] w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center mt-2 md:mt-2">
            <i id="comments" class="fa-solid fa-comments text-black text-[18px]"></i>
          </div>
          <i data-path="/settings" class="fa-solid fa-gear text-[18px] text-primary hover:text-secondary transition-all duration-400 ease-in-out"></i>
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


      <div class="h-full w-screen md:ml-[100px] flex items-center justify-center pt-24 pb-6 md:pt-28 md:px-0">  
      <div id="chat_panels_wrapper" 
             class="m-5 mb-4 w-full md:w-[90%] md:mx-auto h-[calc(100vh-12rem)] md:h-[700px] 
                shadow-lg flex md:flex-row relative overflow-hidden text-white gap-x-4">
        <div id="contacts_side" class="w-full h-full md:w-1/3 flex-shrink-0 overflow-hidden"> 
           
            
        <div class="w-full bg-primary/60 rounded-xl border-blue p-4 flex flex-col h-full overflow-hidden">
           <div class="relative ">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
               
              <input
                type="search"
                id="default-search"
                class="block bg-primary/80 w-full h-[35px] px-4 ps-9 text-sm text-white rounded-2xl border-none focus:outline-none placeholder-white"
                placeholder="Search ..." 
                required
              />

            </div>
               
            
        <div class="space-y-4 mt-3 pb-8 h-full overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary/20">
            </div>

        </div>
          </div>

          <div class="h-full w-full md:w-[80%] "> 
            
        <div id="main_chat" 
         class="w-full h-full 
                hidden 
                absolute top-0 left-0  
                shadow-lg overflow-hidden text-white rounded-xl
                md:relative md:flex lg:w-[90%] md:w-[90%] md:h-[700px]">        <div id="chatContainer" class="w-full h-full flex flex-col">
                <div id="chatHeader" class="hidden relative flex items-center justify-between p-3 rounded-t-xl bg-primary/80"> <div class="flex items-center gap-3">
                <i id="backToContacts"
          class="fa-solid fa-arrow-left bg-primary cursor-pointer p-3 rounded-full text-white md:hidden"></i>
    <img id="chatContactAvatar" src="../../public/green-girl.svg" class="w-12 h-12 object-cover border border-primary rounded-full">
              <div>
                <p id="chatContactUsername" class=" text-secondary font-bold text-sm">Select a Contact</p>
                <p id="chatContactStatus" class="text-xs text-gray-200">Offline</p>
              </div>
            </div>
            
            <button id="menuToggle" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/20 transition-all">
            <i class="fa-solid fa-ellipsis-vertical text-secondary"></i>
            </button>

          <div id="dropdownMenu" class="hidden absolute right-3 top-12 bg-#35C6DD backdrop-blur-md rounded-lg shadow-lg py-2 w-40 z-50">
            <button class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
              <i class="fas fa-circle-info"></i>
              Contact Info
            </button>
            
            <button id="closeChat" class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
              <i class="fa-regular fa-times-circle"></i>
              Close Chat
            </button>
            <button id="blockUserBtn"  class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
              <i class="fa fa-ban"></i>
              Block User
            </button>
        </div>
    </div>


            <div id="messagesPanel" class="flex-1 p-4 space-y-4 overflow-y-auto bg-primary/60 min-h-0">
              <div class="flex-1 flex items-center justify-center h-full">
                   <h1 class="text-center text-primary/65  font-bold text-4xl ">Ping Pong<br>Chat</h1>
              </div>

            </div>

            <div id="blockConfirmation" class="hidden absolute inset-0 flex items-center justify-center z-50">
                <div class="confirm bg-primary/65 p-6 rounded-xl shadow-md text-center max-w-xs w-full mx-2 min-h-[160px] flex flex-col justify-between">
                  <p class="mb-2 text-white text-lg">Block <strong>${contactUsername}</strong>?</p>
                  <div class="flex items-center justify-center gap-3 mt-4">
                    <button id="confirmBlockBtn" class="bg-red-500 hover:bg-red-700 text-white rounded-2xl font-bold py-2 px-4 rounded">Block</button>
                    <button id="cancelBlockBtn" class="bg-green-400 hover:bg-green-700 text-white rounded-2xl font-bold py-2 px-4 rounded">Cancel</button>
                 </div>
                
              </div>
            </div>

            <div class="relative">
                <div id="messageInputContainer" class="hidden p-4 bg-primary/60 rounded-b-xl">
                  <div class="relative">
                    
                    <i id="sendMessageBtn" class="fa-regular fa-paper-plane text-secondary absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"></i>
                    <i class="fa-solid fa-plus text-secondary absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"></i>
                    <i class="fa-solid fa-table-tennis-paddle-ball text-secondary absolute left-9 top-1/2 -translate-y-1/2 cursor-pointer"></i>
                    
                    <input 
                      type="text" 
                      id="messageInput"
                      placeholder="Type a message..." 
                      class="w-full pl-16 pr-10 py-2 rounded-full bg-primary/65 text-white placeholder-white focus:outline-none">
                  </div>
                </div>

               
            </div>
            </div>
            </div>
            
       </div>
        </div>
      </div>
      </div>
    </div>
    `;
}
