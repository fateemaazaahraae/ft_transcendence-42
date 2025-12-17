
import { debounce, searchUsers, fetchContacts, renderSearchResults } from "../utils/searchHandler.ts";
import { blockUser, unblockUser, checkIfBlocked, showMessageInput, showBlockedMessage } from "../utils/blockHandler.ts";
import { initializeSocket,sendMessage,listenForMessagesReceived } from "../utils/sockeService.ts";
import {
    updateContactStatusUI,
    updateChatHeader,
    attachContactClickListeners,
    setupMenuToggle,
    setupDropdownClose,
    setupCloseChat,
    setupBackToContacts,
    setupWindowResize
} from "./chatHelpers.ts";
import { renderSingleMessage } from "./chatHelpers.ts";

export function ChatEventListener() {
    const API_BASE_URL: string = 'http://localhost:4000/api';
    const WS_URL: string = 'ws://localhost:8443/ws';
    const CURRENT_USER_ID: number = 1;

    let ACTIVE_CHAT_CONTACT_ID: number | null = null;
    let CURRENT_USER_AVATAR: string = '../../public/green-girl.svg';

    //connect to socket.io
    initializeSocket(CURRENT_USER_ID, 'http://localhost:4000');

    // restore active chat 
    const savedContactId = localStorage.getItem('activeContactId');
    const savedContactUsername = localStorage.getItem('activeContactUsername');
    const savedContactAvatar = localStorage.getItem('activeContactAvatar');
    const savedContactStatus = localStorage.getItem('activeContactStatus');
    

    // DOM 
    const menuToggle = document.getElementById("menuToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const closeButton = document.getElementById("closeChat");
    const contactsSide = document.getElementById("contacts_side");
    const chat = document.getElementById("main_chat");
    const chatHeader = document.getElementById("chatHeader");
    const backToContactsBtn = document.getElementById('backToContacts');

    const chatUsername = document.getElementById('chatContactUsername');
    const chatStatus = document.getElementById('chatContactStatus');
    const chatAvatar = document.getElementById('chatContactAvatar') as HTMLImageElement | null;
    const searchInput = document.getElementById('default-search') as HTMLInputElement | null;

    const setChatUIState = (hasActiveChat: boolean) => {
        if (hasActiveChat) {
            chatHeader?.classList.remove("hidden");
        } else {
            chatHeader?.classList.add("hidden");
        }
    };

    // block button listener
    const blockBtn = document.getElementById("blockUserBtn");
    if (blockBtn) {
        blockBtn.addEventListener("click", (): void => {
            const contactUsername = document.getElementById('chatContactUsername')?.textContent || '';
            if (ACTIVE_CHAT_CONTACT_ID) {
                blockUser(CURRENT_USER_ID, ACTIVE_CHAT_CONTACT_ID);
            }
        });
    }

   
    const unblockBtn = document.getElementById("unblockUserBtn");
    if (unblockBtn) {
        unblockBtn.addEventListener('click', () => {
            if (ACTIVE_CHAT_CONTACT_ID) {
                unblockUser(CURRENT_USER_ID, ACTIVE_CHAT_CONTACT_ID);
            }
        });
    }

  
    const contactsListDiv = document.querySelector('#contacts_side .space-y-4') as HTMLElement | null;
    console.log('contactsListDiv found:', contactsListDiv);

    
    setChatUIState(false);

    const debouncedSearch = debounce((query: string) => {
        if (!query.trim()) {
            if (contactsListDiv) {
                fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
                    attachContactClickListeners(contactsListDiv, handleContactSelect);
                });
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

   
    const handleContactSelect = (contactId: number, username: string, avatar: string, status: string) => {
        ACTIVE_CHAT_CONTACT_ID = contactId;
        setChatUIState(true);

        // save in case of refresh
        localStorage.setItem('activeContactId', String(contactId));
        localStorage.setItem('activeContactUsername', username);
        localStorage.setItem('activeContactAvatar', avatar);
        localStorage.setItem('activeContactStatus', status);

        if (window.innerWidth < 768) {
            contactsSide?.classList.add("hidden");
        } else {
            contactsSide?.classList.remove("hidden");
        }
        chat?.classList.remove("hidden");
        chat?.classList.add("flex");

       
        updateChatHeader(chatUsername, chatStatus, chatAvatar, username, status, avatar);

        // check if contact is blocked
        checkIfBlocked(CURRENT_USER_ID, contactId, (isBlocked) => {
            console.log(`Is contact (ID: ${contactId}) blocked?`, isBlocked);
            if (isBlocked) {
                showBlockedMessage();
            } else {
                showMessageInput();
            }
        });

    
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            contactsSide?.classList.add("hidden");
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
        }


        //FETCH MESSAGES AND RENDER THEM 
        const messagePanel = document.getElementById("messagesPanel") as HTMLElement | null;
        if (messagePanel) {
            messagePanel.innerHTML = "";
            const userId1 = String(CURRENT_USER_ID);
            const userId2 = String(contactId);
            
            //fetch from api
            fetch(`${API_BASE_URL}/chats/history/${userId1}/${userId2}`)
                .then(response => response.json())
                .then(data => {
                    const messages = data?.messages || [];
                    console.log("fetched messages:", messages);
                    
                    messages.forEach((msg: any) => {
                        const isSender = String(msg.sender_id) === String(userId1);
                        renderSingleMessage(msg, isSender, messagePanel);
                    });
                })
                .catch(error => {
                    console.error("Error fetching chat history:", error);
                });
        }
    };

    if (backToContactsBtn) {
        setupBackToContacts(backToContactsBtn, () => {
            ACTIVE_CHAT_CONTACT_ID = null;
            setChatUIState(false);
            
            // clear storage
            localStorage.removeItem('activeContactId');
            localStorage.removeItem('activeContactUsername');
            localStorage.removeItem('activeContactAvatar');
            localStorage.removeItem('activeContactStatus');
            
            contactsSide?.classList.remove("hidden");
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
        });
    }

   
    setupWindowResize(() => {
        if (!ACTIVE_CHAT_CONTACT_ID) {
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
            contactsSide?.classList.remove("hidden");
            return;
        }
        chat?.classList.remove("hidden");
        chat?.classList.add("flex");
        if (window.innerWidth < 768) {
            contactsSide?.classList.add("hidden");
        } else {
            contactsSide?.classList.remove("hidden");
        }
    });

   
    if (menuToggle && dropdownMenu) {
        setupMenuToggle(menuToggle, dropdownMenu);
        setupDropdownClose(dropdownMenu);
    }

    
    if (closeButton) {
        setupCloseChat(closeButton, () => {
            ACTIVE_CHAT_CONTACT_ID = null;
            setChatUIState(false);
            
            // clear storage when closing chat
            localStorage.removeItem('activeContactId');
            localStorage.removeItem('activeContactUsername');
            localStorage.removeItem('activeContactAvatar');
            localStorage.removeItem('activeContactStatus');
            
            const chatDiv = document.getElementById("messagesPanel");
            if (chatDiv) {
                chatDiv.innerHTML = `<div class="flex-1 flex items-center justify-center h-full">
                    <h1 class="text-center text-primary/65 font-bold text-4xl">Ping Pong<br>Chat</h1>
                </div>`;
            }
            contactsSide?.classList.remove("hidden");
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
            document.getElementById("dropdownMenu")?.classList.add("hidden");
        });
    }

   
    if (contactsListDiv) {
        fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
            attachContactClickListeners(contactsListDiv, handleContactSelect);
            
            // 
            //restore active chat if exists
            if (savedContactId && savedContactUsername) {
                                
                const contactId = parseInt(savedContactId);
                handleContactSelect(
                    contactId, 
                    savedContactUsername, 
                    savedContactAvatar || '../../public/default.svg', 
                    savedContactStatus || 'offline'
                );
            }
        });
    }



    //socket eventhandlers
    const messageInput =document.getElementById("messageInput") as HTMLInputElement | null;
    const sendButton = document.getElementById("sendMessageBtn");
    const messagesPanel = document.getElementById("messagesPanel");
    // sendButton?.addEventListener("click", () => {
    //     const message = messageInput?.value.trim();
    const handleSendMessage = () => {
        const content = messageInput?.value.trim();
        if(!content || !ACTIVE_CHAT_CONTACT_ID) return;
        
        console.log("sending message to", ACTIVE_CHAT_CONTACT_ID, "content:", content);
        
        sendMessage(ACTIVE_CHAT_CONTACT_ID, content,(res) => {
            console.log("save ack:", res);
            if(res?.status === "error") {
                console.warn("send failed ", res?.reason || "unknown");
                return;
            }
            
            // render sent message 
            if(res?.status === "ok" && res?.message && messagesPanel) {
                console.log("rendering sent message:", res.message);
                renderSingleMessage(res.message, true, messagesPanel);
            }
        });
        
        if(messageInput) messageInput.value = '';
    }

    sendButton?.addEventListener('click', handleSendMessage);

    listenForMessagesReceived((data) => {
        const msg = data?.message;
        if (!msg) return;

        // only render if message belongs to the active chat
        const isForActiveChat =
            String(msg.sender_id) === String(ACTIVE_CHAT_CONTACT_ID) ||
            String(msg.receiver_id) === String(ACTIVE_CHAT_CONTACT_ID);

        if (isForActiveChat && messagesPanel) {
            renderSingleMessage(msg, String(msg.sender_id) === String(CURRENT_USER_ID), messagesPanel);
        }
    });

}
