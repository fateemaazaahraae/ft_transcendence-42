
import { navigate } from "../main.ts"; 

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

export function ChatEventListener()
{
    const API_BASE_URL: string = 'http://localhost:4000/api';
const WS_URL: string = 'ws://localhost:4000';
    const CURRENT_USER_ID: number = 1; 
    
    let ACTIVE_CHAT_CONTACT_ID: number | null = null; 
    
    let CURRENT_USER_AVATAR: string = '../../public/green-girl.svg'; 
    
    let chatWebSocket: WebSocket | null = null;

    const menuToggle: HTMLElement | null = document.getElementById("menuToggle");
    const dropdownMenu: HTMLElement | null = document.getElementById("dropdownMenu");
    const closebutton: HTMLElement | null = document.getElementById("closeChat");
    const contactsSide: HTMLElement | null = document.getElementById("contacts_side");
    const chat: HTMLElement | null = document.getElementById("main_chat");
    const messagesPanel: HTMLElement | null = document.getElementById("messagesPanel");
    const messageInput: HTMLInputElement | null = document.getElementById("messageInput") as HTMLInputElement | null;
    const sendButton: HTMLElement | null = document.getElementById("sendMessageBtn");
    const backToContactsBtn: HTMLElement | null = document.getElementById('backToContacts'); 
    
    const chatUsername: HTMLElement | null = document.getElementById('chatContactUsername');
    const chatStatus: HTMLElement | null = document.getElementById('chatContactStatus');
    const chatAvatar: HTMLImageElement | null = document.getElementById('chatContactAvatar') as HTMLImageElement | null;

    interface WebSocketMessage {
        type: 'chat' | 'status' | 'error';
        sender_id: number;
        receiver_id: number;
        content: string;
        timestamp: string;
        user_id: number;
        status: 'online' | 'offline';
        id: number;
    }

    function connectWS(): void {
        if (chatWebSocket) chatWebSocket.close();
        
        chatWebSocket = new WebSocket(`${WS_URL}?user_id=${CURRENT_USER_ID}`);
        
        chatWebSocket.onopen = (): void => console.log("WebSocket connected.");
        
        chatWebSocket.onmessage = (event: MessageEvent): void => {
            //  assert the type of data coming in from the server
            const data: Partial<WebSocketMessage> = JSON.parse(event.data);
            handleIncomingData(data);
        };
        
        chatWebSocket.onclose = (): void => {
            console.log("WebSocket disconnected. Attempting to reconnect in 5s...");
            setTimeout(connectWS, 5000);
        };
        chatWebSocket.onerror = (e: Event): void => console.error("WS Error:", e);
    }

    // ------------------ search / contacts integration ------------------
    function debounce<T extends (...args: any[]) => void>(fn: T, wait = 250) {
        let t: number | undefined;
        return (...args: Parameters<T>) => {
            if (t) window.clearTimeout(t);
            t = window.setTimeout(() => fn(...args), wait) as unknown as number;
        };
    }

    async function searchUsers(q: string) {
        if (!q || q.trim().length === 0) {
            fetchContacts();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(q)}&userId=${CURRENT_USER_ID}`);
            const users = await res.json();
            renderSearchResults(users);
        } catch (err) {
            console.error('search error', err);
        }
    }

    function renderSearchResults(users: Array<{id:number,username:string,avatar:string,status:string}>) {
        const contactsListDiv: HTMLElement | null | undefined = contactsSide?.querySelector('.space-y-4');
        if (!contactsListDiv) return;

        contactsListDiv.innerHTML = users.map(u => {
            const statusClass = (u.status === 'online') ? 'bg-greenAdd' : 'bg-redRemove';
            const avatar = u.avatar || '../../public/default.svg';
            const lastMessage = 'Search result';
            return `
                <div class="scroll flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded contact-item"
                     data-contact-id="${u.id}"
                     data-contact-username="${u.username}"
                     data-contact-avatar="${avatar}"
                     data-contact-status="${u.status}">
                    <div class="relative w-12 h-12 flex-shrink-0">
                        <img src="${avatar}" class="w-12 h-12 object-cover border border-primary rounded-full">
                        <div id="status-${u.id}" class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusClass}"></div>
                    </div>
                    <div>
                        <p class="font-medium text-sm text-secondary ">${u.username}</p>
                        <p class="text-xs text-gray-200">${lastMessage}</p>
                    </div>
                </div>
            `;
        }).join('');

        attachContactClickListeners();
    }

    // search input
    const searchInput: HTMLInputElement | null = document.getElementById('default-search') as HTMLInputElement | null;
    const onSearch = debounce((e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        searchUsers(v);
    }, 250);
    searchInput?.addEventListener('input', onSearch);

    function handleIncomingData(data: Partial<WebSocketMessage>): void {
        
        if (data.type === 'chat' && data.sender_id !== undefined && data.receiver_id !== undefined) {
            const isSender: boolean = data.sender_id === CURRENT_USER_ID;
            
            if (data.sender_id === ACTIVE_CHAT_CONTACT_ID || data.receiver_id === ACTIVE_CHAT_CONTACT_ID) {
                //  ensure data is treated as the full message object for rendering
                renderSingleMessage(data as WebSocketMessage, isSender);
            }
            fetchContacts(); 

        } else if (data.type === 'status' && data.user_id !== undefined && data.status !== undefined) {
            updateContactStatusUI(data.user_id, data.status);
        }
    }

    function sendMessage(receiverId: number, content: string): void {
        if (content && chatWebSocket && chatWebSocket.readyState === WebSocket.OPEN) {
            const message: object = {
                type: 'chat',
                receiver_id: receiverId,
                content: content
            };
            chatWebSocket.send(JSON.stringify(message));
            if (messageInput) {
                 messageInput.value = '';
            }
        } else {
            console.warn('Cannot send message: WebSocket not ready or no active chat.');
        }
    }

    // function type definition for map callback
    interface Contact {
        id: number;
        username: string;
        status: 'online' | 'offline';
        avatar: string;
        last_message: string | null;
    }

    function fetchContacts(): void {
        fetch(`${API_BASE_URL}/chats/contacts/${CURRENT_USER_ID}`)
            .then((res: Response) => res.json())
            .then((contacts: Contact[]) => {
                const contactsListDiv: HTMLElement | null | undefined = contactsSide?.querySelector('.space-y-4');
                if (!contactsListDiv) return;

                contactsListDiv.innerHTML = contacts.map((contact: Contact) => {
                    const statusClass: string = contact.status === 'online' ? 'bg-greenAdd' : 'bg-redRemove';
                    const lastMessage: string = contact.last_message || 'No messages yet.';
                    const contactAvatar: string = contact.avatar || '../../public/default.svg';
                    
                    return `
                        <div class="scroll flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded contact-item" 
                             data-contact-id="${contact.id}" 
                             data-contact-username="${contact.username}"
                             data-contact-avatar="${contactAvatar}"
                             data-contact-status="${contact.status}">
                            <div class="relative w-12 h-12 flex-shrink-0">
                                <img src="${contactAvatar}" class="w-12 h-12 object-cover border border-primary rounded-full">
                                <div id="status-${contact.id}" class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusClass}"></div>
                            </div>
                            <div>
                                <p class="font-medium text-sm text-secondary ">${contact.username}</p>
                                <p class="text-xs text-gray-200">${lastMessage}</p>
                            </div>
                        </div>
                    `;
                }).join('');

                attachContactClickListeners();
            })
            .catch((err: Error) => console.error('Error fetching contacts:', err));
    }

    // type definition for message object
    interface ChatMessage {
        id: number;
        sender_id: number;
        receiver_id: number;
        content: string;
        timestamp: string;
    }

    function fetchMessages(contactId: number): void {
        fetch(`${API_BASE_URL}/chats/messages/${CURRENT_USER_ID}/${contactId}`)
            .then((res: Response) => res.json())
            .then((messages: ChatMessage[]) => {
                if (messagesPanel) {
                    messagesPanel.innerHTML = '';
                }
                messages.forEach((msg: ChatMessage) => {
                    const isSender: boolean = msg.sender_id === CURRENT_USER_ID;
                    renderSingleMessage(msg, isSender);
                });
                messagesPanel?.scrollTo(0, messagesPanel.scrollHeight);
            })
            .catch((err: Error) => console.error('Error fetching messages:', err));
    }

    function attachContactClickListeners(): void {
        document.querySelectorAll(".contact-item").forEach((item: Element) => {
            item.addEventListener("click", () => {
                const htmlItem = item as HTMLElement; 
                const contactId: number = parseInt(htmlItem.getAttribute('data-contact-id') || '0');
                const username: string = htmlItem.getAttribute('data-contact-username') || '';
                const avatar: string = htmlItem.getAttribute('data-contact-avatar') || '';
                const status: string = htmlItem.getAttribute('data-contact-status') || '';

                if (contactId) {
                    ACTIVE_CHAT_CONTACT_ID = contactId;
                    
                    if (chatUsername) chatUsername.textContent = username;
                    if (chatStatus) chatStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                    if (chatAvatar) chatAvatar.src = avatar;

                    fetchMessages(contactId);
                }
                
                const isMobile = (): boolean => window.innerWidth < 768;
                if (isMobile()) {
                    contactsSide?.classList.add("hidden"); 
                    chat?.classList.remove("hidden");
                    chat?.classList.add("flex"); 
                }
            });
        });
    }

    function renderSingleMessage(message: ChatMessage, isSender: boolean): void {
        if (!messagesPanel) return;
        
        const otherUserId: number = isSender ? message.receiver_id : message.sender_id;
        
        const contactItem: Element | null = document.querySelector(`.contact-item[data-contact-id="${otherUserId}"]`);
        
        const otherUserAvatar: string = contactItem?.getAttribute('data-contact-avatar') || '../../public/default.svg';
        
        const messageAvatar: string = isSender ? CURRENT_USER_AVATAR : otherUserAvatar;

        const messageHTML: string = `
            <div class="flex items-start ${isSender ? 'justify-end' : ''}">
                ${!isSender ? `<img src="${messageAvatar}" class="w-[50px] h-[50px] object-cover mr-3 border border-primary rounded-full flex-shrink-0">` : ''}
                <div class="bg-primary/65 text-sm text-white p-3 rounded-3xl max-w-[60%]">
                    ${message.content}
                    <span class="text-[10px] text-gray-400 block text-right">${new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                ${isSender ? `<img src="${messageAvatar}" class="w-[50px] h-[50px] object-cover ml-3 border border-primary rounded-full flex-shrink-0">` : ''}
            </div>
        `;
        messagesPanel.insertAdjacentHTML('beforeend', messageHTML);
        messagesPanel.scrollTo(0, messagesPanel.scrollHeight);
    }
    
    function updateContactStatusUI(id: number, status: 'online' | 'offline'): void {
        const statusElement: HTMLElement | null = document.getElementById(`status-${id}`);
        if (statusElement) {
            statusElement.classList.remove('bg-greenAdd', 'bg-redRemove');
            statusElement.classList.add(status === 'online' ? 'bg-greenAdd' : 'bg-redRemove');
            
            const contactItem: Element | null = document.querySelector(`.contact-item[data-contact-id="${id}"]`);
            contactItem?.setAttribute('data-contact-status', status);
        }

        if (id === ACTIVE_CHAT_CONTACT_ID && chatStatus) {
            chatStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    }

    sendButton?.addEventListener('click', (): void => {
        const content: string = messageInput?.value.trim() || '';
        if (content && ACTIVE_CHAT_CONTACT_ID) {
            sendMessage(ACTIVE_CHAT_CONTACT_ID, content);
        }
    });


    backToContactsBtn?.addEventListener("click", (): void => {
        const isMobile = (): boolean => window.innerWidth < 768;
        if (isMobile()) {
            chat?.classList.add("hidden");
            chat?.classList.remove("flex"); 
            contactsSide?.classList.remove("hidden");
        }
    });
    

    window.addEventListener("resize", (): void => {
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
    

    menuToggle?.addEventListener("click", (): void => { dropdownMenu?.classList.toggle("hidden"); });
    document.addEventListener("click", (e: MouseEvent): void => {
        const target: EventTarget | null = e.target;
        if(target instanceof Node && menuToggle && dropdownMenu && !menuToggle.contains(target) && !dropdownMenu.contains(target)) { 
            dropdownMenu.classList.add("hidden"); 
        }
    });


    closebutton?.addEventListener("click", (): void => {
        const chatDiv: HTMLElement | null = document.getElementById("chatContainer");
        if(chatDiv) {
            chatDiv.innerHTML=`<div class="flex-1 flex items-center justify-center p-4 rounded-2xl overflow-y-auto bg-primary/60">
                <h1 class="text-center text-primary/65  font-bold text-4xl ">Ping Pong<br>Chat</h1>
            </div>`;
        } 
        document.getElementById("dropdownMenu")?.classList.add("hidden");
    });
    
    connectWS();
    fetchContacts();
}