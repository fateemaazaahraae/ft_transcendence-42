
import { navigate } from "../main.ts";
import { connectWS, sendMessage as sendWSMessage } from "../utils/websocketHandler.ts";
import { debounce, searchUsers, fetchContacts, renderSearchResults } from "../utils/searchHandler.ts"; 

export default function Chat() {
 
 
  return `
  <div class="class="h-screen overflow-hidden flex items-center justify-center text-white font-roboto px-6 md:px-20 py-6 relative flex flex-col">
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

  <div class="h-full w-screen md:ml-[100px] flex items-center justify-center pt-24 pb-6 md:pt-28 md:px-0">  
  <div id="chat_panels_wrapper" 
         class="m-5 mb-4 w-full md:w-[90%] md:mx-auto h-[calc(100vh-12rem)] md:h-[700px] 
            shadow-lg flex md:flex-row relative overflow-hidden text-white gap-x-4">
    <div id="contacts_side" class="w-full h-full md:w-1/3 flex-shrink-0 "> 
   
    
    <div class="w-full bg-primary/60 rounded-xl border-blue p-4 flex flex-col h-full">
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
       
    
    <div class="space-y-4 mt-3 mb-3 pb-8 h-full overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        </div>

    </div>
      </div>

      <div class="h-full w-full md:w-[80%] "> 
    
   <div id="main_chat" 
     class="w-full h-full 
            absolute top-0 left-0  
            shadow-lg overflow-hidden text-white 
            hidden 
            md:relative md:flex lg:w-[90%] md:w-[90%] md:h-[700px]">
        
        <div id="chatContainer" class="w-full h-full flex flex-col">
            <div class="relative flex items-center justify-between p-3 rounded-t-xl bg-primary/80"> <div class="flex items-center gap-3">
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
        <button class="w-full text-left px-2 py-2 hover:bg-primary/65 hover:rounded-2xl text-white text-[14px] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
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

        <div class="relative">
            <div class="p-4 bg-primary/60 rounded-b-xl">
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
  `;
}

// MESSAGE HANDLING FUNCTIONS 
interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
}

function renderSingleMessage(
    message: ChatMessage | any,
    isSender: boolean,
    messagesPanel: HTMLElement
): void {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`;
    msgDiv.innerHTML = `
        <div class="${isSender ? 'bg-secondary text-black' : 'bg-primary/65 text-white'} rounded-lg px-4 py-2 max-w-xs">
            <p class="text-sm break-words">${message.content || ''}</p>
            <p class="text-xs opacity-70 mt-1">${new Date(message.timestamp || Date.now()).toLocaleTimeString()}</p>
        </div>
    `;
    messagesPanel?.appendChild(msgDiv);
    messagesPanel?.scrollTo(0, messagesPanel.scrollHeight);
}

function fetchMessages(
    API_BASE_URL: string,
    CURRENT_USER_ID: number,
    contactId: number,
    messagesPanel: HTMLElement,
    onComplete?: () => void
): void {
    fetch(`${API_BASE_URL}/chats/messages/${CURRENT_USER_ID}/${contactId}`)
        .then((res) => res.json())
        .then((messages: ChatMessage[]) => {
            if (messagesPanel) {
                messagesPanel.innerHTML = '';
            }
            
            messages.forEach((msg: ChatMessage) => {
                const isSender = msg.sender_id === CURRENT_USER_ID;
                renderSingleMessage(msg, isSender, messagesPanel);
            });
            
            messagesPanel?.scrollTo(0, messagesPanel.scrollHeight);
            if (onComplete) onComplete();
        })
        .catch((err) => {
            console.error('Error fetching messages:', err);
        });
}

function updateContactStatusUI(userId: number, status: string): void {
    const statusElement = document.getElementById(`status-${userId}`);
    if (statusElement) {
        statusElement.className = `absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            status === 'online' ? 'bg-greenAdd' : 'bg-redRemove'
        }`;
    }
}

function updateChatHeader(
    chatUsername: HTMLElement | null,
    chatStatus: HTMLElement | null,
    chatAvatar: HTMLImageElement | null,
    username: string,
    status: string,
    avatar: string
): void {
    if (chatUsername) chatUsername.textContent = username;
    if (chatStatus) chatStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    if (chatAvatar) chatAvatar.src = avatar;
}

// UI EVENT HANDLERS 
function attachContactClickListeners(
    contactsListDiv: HTMLElement,
    onContactSelect: (contactId: number, username: string, avatar: string, status: string) => void
): void {
    document.querySelectorAll(".contact-item").forEach((item: Element) => {
        item.addEventListener("click", () => {
            const htmlItem = item as HTMLElement;
            const contactId: number = parseInt(htmlItem.getAttribute('data-contact-id') || '0');
            const username: string = htmlItem.getAttribute('data-contact-username') || '';
            const avatar: string = htmlItem.getAttribute('data-contact-avatar') || '';
            const status: string = htmlItem.getAttribute('data-contact-status') || '';

            if (contactId) {
                onContactSelect(contactId, username, avatar, status);
            }
        });
    });
}

function setupMenuToggle(menuToggle: HTMLElement, dropdownMenu: HTMLElement): void {
    menuToggle.addEventListener("click", (): void => {
        dropdownMenu.classList.toggle("hidden");
    });
}

function setupDropdownClose(dropdownMenu: HTMLElement): void {
    document.addEventListener("click", (e: MouseEvent): void => {
        const target: EventTarget | null = e.target;
        if (
            target instanceof HTMLElement &&
            !target.closest("#dropdownMenu") &&
            !target.closest("#menuToggle")
        ) {
            dropdownMenu.classList.add("hidden");
        }
    });
}

function setupCloseChat(closeButton: HTMLElement, onClose: () => void): void {
    closeButton?.addEventListener("click", (): void => {
        onClose();
    });
}

function setupBackToContacts(backButton: HTMLElement, onBack: () => void): void {
    backButton?.addEventListener("click", (): void => {
        onBack();
    });
}

function setupMessageSend(
    sendButton: HTMLElement,
    messageInput: HTMLInputElement,
    onSend: (content: string) => void
): void {
    sendButton?.addEventListener('click', (): void => {
        const content = messageInput?.value.trim() || '';
        if (content) {
            onSend(content);
        }
    });
}

function setupWindowResize(onResize: () => void): void {
    window.addEventListener("resize", (): void => {
        onResize();
    });
}

//  CHAT EVENT LISTENER 
export function ChatEventListener() {
    
    const API_BASE_URL: string = 'http://localhost:4000/api';
    const WS_URL: string = 'ws://localhost:4000';
    const CURRENT_USER_ID: number = 1;
    
    
    let ACTIVE_CHAT_CONTACT_ID: number | null = null;
    let CURRENT_USER_AVATAR: string = '../../public/green-girl.svg';

    
    const menuToggle = document.getElementById("menuToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const closeButton = document.getElementById("closeChat");
    const contactsSide = document.getElementById("contacts_side");
    const chat = document.getElementById("main_chat");
    const messagesPanel = document.getElementById("messagesPanel");
    const messageInput = document.getElementById("messageInput") as HTMLInputElement | null;
    const sendButton = document.getElementById("sendMessageBtn");
    const backToContactsBtn = document.getElementById('backToContacts');
    
    const chatUsername = document.getElementById('chatContactUsername');
    const chatStatus = document.getElementById('chatContactStatus');
    const chatAvatar = document.getElementById('chatContactAvatar') as HTMLImageElement | null;
    const searchInput = document.getElementById('default-search') as HTMLInputElement | null;

    // contacts list div
    const contactsListDiv = contactsSide?.querySelector('.space-y-4') as HTMLElement | null;

    //--websocket handler 
    const handleIncomingMessage = (data: any) => {
        if (data.type === 'chat' && data.sender_id !== undefined && data.receiver_id !== undefined) {
            const isSender = data.sender_id === CURRENT_USER_ID;
            
            if (data.sender_id === ACTIVE_CHAT_CONTACT_ID || data.receiver_id === ACTIVE_CHAT_CONTACT_ID) {
                if (messagesPanel) {
                    renderSingleMessage(data, isSender, messagesPanel);
                }
            }
            
            //refreshing contacts to update last message
            if (contactsListDiv) {
                fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv);
            }
        } else if (data.type === 'status' && data.user_id !== undefined && data.status !== undefined) {
            updateContactStatusUI(data.user_id, data.status);
        }
    };

    // --connect to websocket 
    connectWS(CURRENT_USER_ID, WS_URL, handleIncomingMessage);

    // --search handler 
    const debouncedSearch = debounce((query: string) => {
        if (!query.trim()) {
            if (contactsListDiv) {
                fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv);
            }
            return;
        }
        
        searchUsers(query, API_BASE_URL, CURRENT_USER_ID, (results) => {
            if (contactsListDiv) {
                renderSearchResults(results, contactsListDiv);
                attachContactClickListeners(contactsListDiv, handleContactSelect);
            }
        });
    }, 250);

    searchInput?.addEventListener('input', (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        debouncedSearch(value);
    });

    // --contact select handler
    const handleContactSelect = (contactId: number, username: string, avatar: string, status: string) => {
        ACTIVE_CHAT_CONTACT_ID = contactId;
        
        // update chat header
        updateChatHeader(chatUsername, chatStatus, chatAvatar, username, status, avatar);
        
        // fetchi and display messages
        if (messagesPanel) {
            fetchMessages(API_BASE_URL, CURRENT_USER_ID, contactId, messagesPanel);
        }
        
        // Show chat on mobile
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            contactsSide?.classList.add("hidden");
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
        }
    };

   //--message send handler 
    const handleSendMessage = (content: string) => {
        if (content && ACTIVE_CHAT_CONTACT_ID) {
            sendWSMessage(ACTIVE_CHAT_CONTACT_ID, content);
            if (messageInput) {
                messageInput.value = '';
            }
        }
    };

    //UI event listener 
    
    // send button
    if (sendButton && messageInput) {
        setupMessageSend(sendButton, messageInput, handleSendMessage);
    }

    // back to contacts button
    if (backToContactsBtn) {
        setupBackToContacts(backToContactsBtn, () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                chat?.classList.add("hidden");
                chat?.classList.remove("flex");
                contactsSide?.classList.remove("hidden");
            }
        });
    }

    // window resize
    setupWindowResize(() => {
        if (window.innerWidth >= 768) {
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
            contactsSide?.classList.remove("hidden");
        } else {
            contactsSide?.classList.remove("hidden");
            chat?.classList.add("hidden");
            chat?.classList.remove("flex");
        }
    });

    // side menu 
    if (menuToggle && dropdownMenu) {
        setupMenuToggle(menuToggle, dropdownMenu);
        setupDropdownClose(dropdownMenu);
    }

    //  chat button
    if (closeButton) {
        setupCloseChat(closeButton, () => {
            const chatDiv = document.getElementById("chatContainer");
            if (chatDiv) {
                chatDiv.innerHTML = `<div class="flex-1 flex items-center justify-center p-4 rounded-2xl overflow-y-auto bg-primary/60">
                    <h1 class="text-center text-primary/65 font-bold text-4xl">Ping Pong<br>Chat</h1>
                </div>`;
            }
            document.getElementById("dropdownMenu")?.classList.add("hidden");
        });
    }

    // --initial load of contacts
    if (contactsListDiv) {
        fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv);
        // attach click listeners 
        setTimeout(() => {
            attachContactClickListeners(contactsListDiv, handleContactSelect);
        }, 100);
    }
}