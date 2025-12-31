
import { debounce, searchUsers, fetchContacts, renderSearchResults } from "../utils/searchHandler.ts";
import { loadUser } from "../utils/loadUser.ts";
import { blockUser, unblockUser, checkIfBlocked, showMessageInput, showBlockedMessage } from "../utils/blockHandler.ts";
import { socket, initializeSocket, sendMessage, listenForMessagesReceived, subscribeConnection } from "../utils/sockeService.ts";
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
    const HOST = window.location.hostname;
    const PROTO = window.location.protocol;
    
    let API_BASE_URL: string;
    let WS_URL: string;
    if (PROTO === 'https:') {
        API_BASE_URL = `${window.location.origin}/api`;
        WS_URL = window.location.origin; 
    } else {
        API_BASE_URL = `${PROTO}//${HOST}:4000/api`;
        WS_URL = `${PROTO}//${HOST}:4000`;
    }
    let CURRENT_USER_ID: string | number | null = (() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        try {
            const payload = JSON.parse(atob(parts[1]));
            return payload.id || null;
        } catch (e) {
            console.warn('JWT parse error', e);
            return null;
        }
    })();

    
    if (!CURRENT_USER_ID) {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            CURRENT_USER_ID = storedId;
            console.log('[chat] using fallback userId from localStorage', storedId);
        }
    }

    let ACTIVE_CHAT_CONTACT_ID: string | number | null = null;
    let CURRENT_USER_AVATAR: string = '../../public/green-girl.svg';

        // load user profile from  loadUser
        loadUser().then(() => {
            try {
                const stored = localStorage.getItem('user');
                if (!stored) return;
                const user = JSON.parse(stored);
                const img = user?.profileImage || user?.profile_image;
                if (!img) return;
                if (/^https?:\/\//.test(img)) {
                    CURRENT_USER_AVATAR = img;
                } else if (img.startsWith('/')) {
                    CURRENT_USER_AVATAR = `${window.location.origin}${img}`;
                } else {
                    CURRENT_USER_AVATAR = `${API_BASE_URL}/${img}`;
                }
            } catch (e) {
                console.warn('failed to read stored user', e);
            }
        }).catch(() => {});

    //connect to socket.io
    if (CURRENT_USER_ID == null) {
        console.warn('No user id found in token; chat not initialized');
        return;
    }

    const TOKEN = localStorage.getItem('token') || '';
    console.log('initializing socket with wsUrl', WS_URL);
    initializeSocket(CURRENT_USER_ID, WS_URL, TOKEN);

    //disable send button until socket connected
    const sendButtonEl = document.getElementById("sendMessageBtn") as HTMLButtonElement | null;
    if (sendButtonEl) sendButtonEl.disabled = true;
    // subscribe to connection changes to enable/disable the send button
    subscribeConnection((isConnected) => {
        if (sendButtonEl) sendButtonEl.disabled = !isConnected;
        console.log('socket connection state changed:', isConnected);
    });

    // listen for server notification that *this* user was blocked by someone
    if (socket) {
        socket.off('you_were_blocked');
        socket.on('you_were_blocked', (data: any) => {
            const by = String(data?.by || '');
            // if the blocked user is currently viewing the blocker, hide input
            if (String(ACTIVE_CHAT_CONTACT_ID) === by) {
                showBlockedMessage();
            } else {
            }
        });
    }

    // restore active chat 


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

    // block button and modal handlers
    const blockBtn = document.getElementById("blockUserBtn");
    const blockConfirmationDiv = document.getElementById("blockConfirmation");
    const confirmBlockBtn = document.getElementById("confirmBlockBtn");
    const cancelBlockBtn = document.getElementById("cancelBlockBtn");

    // show modal when user clicks the block menu item
    if (blockBtn) {
        blockBtn.addEventListener("click", (): void => {
            if (blockConfirmationDiv) blockConfirmationDiv.classList.remove("hidden");
        });
    }

    // confirm block: call API and hide modal
    confirmBlockBtn?.addEventListener("click", () => {
        const targetId = String(ACTIVE_CHAT_CONTACT_ID || '').trim();
        const meId = String(CURRENT_USER_ID || '').trim();
        if (!targetId || !meId) {
            console.error('confirmBlock: invalid IDs', { ACTIVE_CHAT_CONTACT_ID, CURRENT_USER_ID });
            //  to avoid repeated clicks
            if (blockConfirmationDiv) blockConfirmationDiv.classList.add("hidden");
            return;
        }
        // call block API with string ids (supports UUIDs)
        checkIfBlocked(meId, targetId, (isBlocked) => {
            if(isBlocked) {
                
                if (blockBtn) {
                    blockBtn.innerHTML = '<i class="fa fa-ban"></i> Unblock User';
                    blockBtn.setAttribute('data-blocked', 'true');
                }
            }else {
                blockUser(meId, targetId);
                if (blockBtn) {
                    blockBtn.innerHTML = '<i class="fa fa-ban"></i> Block User';
                    blockBtn.setAttribute('data-blocked', 'false');
                }
            }
        });
        if (blockConfirmationDiv) blockConfirmationDiv.classList.add("hidden");
        
    });

    // cancel: just hide modal
    cancelBlockBtn?.addEventListener("click", () => {
        if (blockConfirmationDiv) blockConfirmationDiv.classList.add("hidden");
    });

            // if (ACTIVE_CHAT_CONTACT_ID) {
            //     unblockUser(Number(CURRENT_USER_ID), Number(ACTIVE_CHAT_CONTACT_ID));
            // } 
    
    // search input handler


  
    const contactsListDiv = document.querySelector('#contacts_side .space-y-4') as HTMLElement | null;

    
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

   
    const handleContactSelect = (contactId: string | number, username: string, avatar: string, status: string) => {
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
        checkIfBlocked(String(CURRENT_USER_ID), String(contactId), (isBlocked) => {
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


        //fetch user profileimage

        //FETCH MESSAGES AND RENDER THEM 
        const messagePanel = document.getElementById("messagesPanel") as HTMLElement | null;
        if (messagePanel) {
            messagePanel.innerHTML = "";
            const userId1 = String(CURRENT_USER_ID);
            const userId2 = String(contactId);
            
            //fetch 
            fetch(`${API_BASE_URL}/chats/history/${userId1}/${userId2}`)
                .then(response => response.json())
                .then(data => {
                    const messages = data?.messages || [];
                    
                    messages.forEach((msg: any) => {
                        const friendAvatar= avatar;
                        const isSender = String(msg.sender_id) === String(userId1);
                        renderSingleMessage(msg, isSender, messagePanel,CURRENT_USER_AVATAR,friendAvatar);
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
            
            const isMobile = window.innerWidth < 768;
            // on mobile: show contacts, hide chat
            if (isMobile) {
                contactsSide?.classList.remove("hidden");
                chat?.classList.add("hidden");
                chat?.classList.remove("flex");
            } else {
               
                contactsSide?.classList.remove("hidden");
                chat?.classList.remove("hidden");
                chat?.classList.add("flex");
            }
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
            document.getElementById("messageInputContainer")?.classList.add("hidden");
            document.getElementById("dropdownMenu")?.classList.add("hidden");
        });
    }

   
    if (contactsListDiv) {
        fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
            attachContactClickListeners(contactsListDiv, handleContactSelect);
        });
    } else {
        console.error('Cannot fetch contacts - contactsListDiv is null');
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
        // optimistic render: show message immediately in UI
        try {
            const friendAvatar = localStorage.getItem('activeContactAvatar') || '../../public/default.svg';
            const optimisticMsg: any = {
                content,
                sender_id: String(CURRENT_USER_ID),
                created_at: Math.floor(Date.now() / 1000)
            };
            if (messagesPanel) {
                renderSingleMessage(optimisticMsg, true, messagesPanel, CURRENT_USER_AVATAR, friendAvatar);
            }
        } catch (e) { console.warn('optimistic render failed', e); }

        // send to server (ack used only for error handling, do not re-render on ack)
        sendMessage(ACTIVE_CHAT_CONTACT_ID, content, (res) => {
            console.log("save ack:", res);
            if(res?.status === "error") {
                console.warn("send failed ", res?.reason || "unknown");
                if (res?.reason === 'blocked') {
                    showBlockedMessage();
                }
            }
        });
        
        if(messageInput) messageInput.value = '';
    }

    sendButton?.addEventListener('click', handleSendMessage);
    messageInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            handleSendMessage();
        }
    });

    listenForMessagesReceived((data) => {
        const msg = data?.message;
        const convo = data?.conversation;
        if (!msg) return;

        const otherId = convo ? (String(convo.user_a) === String(CURRENT_USER_ID) ? String(convo.user_b) : String(convo.user_a)) : null;
        const isForActiveChat = (String(msg.sender_id) === String(ACTIVE_CHAT_CONTACT_ID)) || (otherId && String(otherId) === String(ACTIVE_CHAT_CONTACT_ID));

        if (isForActiveChat && messagesPanel) {
            const friendAvatar = localStorage.getItem('activeContactAvatar') || '../../public/default.svg';
            renderSingleMessage(msg, String(msg.sender_id) === String(CURRENT_USER_ID), messagesPanel, CURRENT_USER_AVATAR, friendAvatar);
        }
    });

}
