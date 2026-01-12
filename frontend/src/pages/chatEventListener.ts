
import { debounce, searchUsers, fetchContacts, renderSearchResults } from "../utils/searchHandler.ts";
import { loadUser } from "../utils/loadUser.ts";
import { viewFriendProfile } from "./viewFriendProfile.ts";
import { blockUser, checkIfBlocked, showMessageInput, showBlockedMessage } from "../utils/blockHandler.ts";
import { socket, initializeSocket, sendMessage, listenForMessagesReceived, subscribeConnection, listenForBlockEvents, listenForPresenceEvents,listenForFriendAccepted } from "../utils/sockeService.ts";
import { setUserOnline, setUserOffline } from "../utils/presenceStore.ts";
import {
    updateChatHeader,
    attachContactClickListeners,
    setupMenuToggle,
    setupDropdownClose,
    setupCloseChat,
    setupBackToContacts,
    setupWindowResize,
    updateUnreadBadge,
    renderSingleMessage,
    updateContactLastMessage,
    updateContactStatusUI,
    applyPresenceToRenderedContacts,
    setActiveChatUser,
    getActiveChatUser
} from "./chatHelpers.ts";



export function ChatEventListener() {
    const HOST = window.location.hostname;
    const PROTO = window.location.protocol;

    let API_BASE_URL: string;
    let WS_URL: string;
    if (PROTO === 'https:') {
        API_BASE_URL = `${window.location.origin}/api`;
        WS_URL = window.location.origin; 
    }
    else {
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
        }
    }

    let ACTIVE_CHAT_CONTACT_ID: string | number | null = null;
    setActiveChatUser(null);
    let CURRENT_USER_AVATAR: string = '../../public/green-girl.svg';

    function resolveChatAvatar(img?: string | null): string {
        const origin = window.location.origin;

        if (!img) return `${origin}/default.png`;

        if (/^https?:\/\//.test(img)) {
            try {
                const u = new URL(img);
                if (
                    u.hostname.includes("auth-service") ||
                    u.hostname.includes("profile-service") ||
                    u.hostname.includes("chat-service") ||
                    u.port === "3000"
                ) {
                    return `${origin}${u.pathname}`;
                }

                if (u.hostname === window.location.hostname) {
                    return img;
                }

                return img;
            } catch {
                return `${origin}/default.png`;
            }
        }

        if (img.startsWith("/")) {
            return `${origin}${img}`;
        }

        const cleaned = img
            .replace(/^(?:\.\.\/|\.\/)+/, "")
            .replace(/^public\//, "")
            .replace(/^\/+/, "");

        return `${origin}/${cleaned}`.replace(/([^:]\/)\/+/g, "$1");
    }

        // load user profile from  loadUser
        loadUser().then(() => {
            try {
                const stored = localStorage.getItem('user');
                if (!stored) return;
                const user = JSON.parse(stored);
                const img = user?.profileImage || user?.profile_image;
                if (!img) return;
                CURRENT_USER_AVATAR = resolveChatAvatar(img) || '/default.png';
            } catch (e) {
                console.warn('failed to read stored user', e);
            }
        }).catch(() => {});



    //connect to socket.io
    if (CURRENT_USER_ID == null) {
        return;
    }

    // initialize socket connection
    const TOKEN = localStorage.getItem('token') || '';
    initializeSocket(CURRENT_USER_ID, WS_URL, TOKEN);
        
     // presence listener: before marking a user online/offline
     listenForPresenceEvents(
        async (userId) => {
            try {
                if (!CURRENT_USER_ID) return;

                const me = String(CURRENT_USER_ID);
                const other = String(userId);

                // helper to wrap checkIfBlocked 
                const isBlockedBy = (blocker: string, blocked: string) => {
                    return new Promise<boolean>((resolve) => {
                        try {
                            checkIfBlocked(blocker, blocked, resolve);
                        } catch (e) {
                            console.warn('isBlockedBy: check failed', e);
                            resolve(false);
                        }
                    });
                };

                // if I blocked them OR they blocked me, hide presence
                const [iBlockedThem, theyBlockedMe] = await Promise.all([isBlockedBy(me, other), isBlockedBy(other, me)]);
                if (iBlockedThem || theyBlockedMe) return;

                setUserOnline(other);
                updateContactStatusUI(other, "online");
            } catch (e) {
                console.warn('presence onOnline handler error', e);
            }
        },
        (userId) => {
            try {
                const other = String(userId);
                setUserOffline(other);
                updateContactStatusUI(other, "offline");
            } catch (e) {
                console.warn('presence onOffline handler error', e);
            }
        }
    );


    // block / unblock
        listenForBlockEvents(({ by }) => {
            if (String(by) === String(ACTIVE_CHAT_CONTACT_ID)) {
                showBlockedMessage();
            }
    });

    //disable send button until socket connected
    const sendButtonEl = document.getElementById("sendMessageBtn") as HTMLButtonElement | null;
    if (sendButtonEl) sendButtonEl.disabled = true;
    // subscribe to connection changes to enable/disable the send button
    subscribeConnection((isConnected) => {
        if (sendButtonEl) sendButtonEl.disabled = !isConnected;
    });


    
    // listen for server notification that this user was blocked by someone
    if (socket) {
        socket.on('you_were_blocked', (data: any) => {
            const by = String(data?.by || '');
            // if the blocked user is currently viewing the blocker hide input
            if (String(ACTIVE_CHAT_CONTACT_ID) === by) {
                showBlockedMessage();
            } else {
            }
        });

        
        // helper to refresh contacts 
        const refreshContacts = () => {
            if (!contactsListDiv) return;
            fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
                attachContactClickListeners(contactsListDiv, handleContactSelect);
                applyPresenceToRenderedContacts();
            });
        };

        // When someone unblocks a user refresh the contacts list so UI updates
        socket?.on("unblock_done", ({ target }: { target: string }) => {
            refreshContacts();
        });
        // refresh contacts in that case too so UI immediately reflects the change
        socket?.on("you_were_unblocked", () => {
            refreshContacts();
        });
        
    }

    


    // DOM 
    const menuToggle = document.getElementById("menuToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const closeButton = document.getElementById("closeChat");
    const contactsSide = document.getElementById("contacts_side");
    const chat = document.getElementById("main_chat");
    const chatHeader = document.getElementById("chatHeader");
    const backToContactsBtn = document.getElementById('backToContacts');
    const contactinfo=document.getElementById('contactInfo');
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

    function setBlockButtonUI(isBlocked: boolean) {
        if (!blockBtn) return;
        if (isBlocked) {
            blockBtn.innerHTML = '<i class="fa fa-ban"></i> Blocked';
            blockBtn.setAttribute('data-blocked', 'true');
            blockBtn.setAttribute('aria-pressed', 'true');
            try { (blockBtn as HTMLButtonElement).disabled = true; } catch (e) {}
            blockBtn.classList.add('opacity-50');
            blockBtn.classList.add('pointer-events-none');
        } else {
            blockBtn.innerHTML = '<i class="fa fa-ban"></i> Block User';
            blockBtn.removeAttribute('data-blocked');
            blockBtn.removeAttribute('aria-pressed');
            try { (blockBtn as HTMLButtonElement).disabled = false; } catch (e) {}
            blockBtn.classList.remove('opacity-50');
            blockBtn.classList.remove('pointer-events-none');
        }
    }

    // confirm block: call API and hide modal
    confirmBlockBtn?.addEventListener("click", async () => {
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
            if (isBlocked) {
                // already blocked: show blocked state on the button
                if (blockBtn) {
                    blockBtn.innerHTML = '<i class="fa fa-ban"></i> Blocked';
                    blockBtn.setAttribute('data-blocked', 'true');
                    blockBtn.setAttribute('aria-pressed', 'true');
                    try { (blockBtn as HTMLButtonElement).disabled = true; } catch (e) {}
                    blockBtn.classList.add('opacity-50');
                    blockBtn.classList.add('pointer-events-none');
                }
            } else {
                // perform block then close chat and show blocked state on the button
                (async () => {
                    const res = await blockUser(meId, targetId);

                    setUserOffline(targetId);
                    updateContactStatusUI(targetId, "offline");

                    if (blockBtn) {
                        blockBtn.innerHTML = '<i class="fa fa-ban"></i> Blocked';
                        blockBtn.setAttribute('data-blocked', 'true');
                        blockBtn.setAttribute('aria-pressed', 'true');
                        try { (blockBtn as HTMLButtonElement).disabled = true; } catch (e) {}
                        blockBtn.classList.add('opacity-50');
                        blockBtn.classList.add('pointer-events-none');
                    }

                    // close chat UI
                    ACTIVE_CHAT_CONTACT_ID = null;
                    setActiveChatUser(null);
                    setChatUIState(false);
                    // clear storage
                    localStorage.removeItem('activeContactId');
                    localStorage.removeItem('activeContactUsername');
                    localStorage.removeItem('activeContactAvatar');
                    localStorage.removeItem('activeContactStatus');

                    // hide message input and reset messages panel
                    document.getElementById("messageInputContainer")?.classList.add("hidden");
                    const chatDiv = document.getElementById("messagesPanel");
                    if (chatDiv) {
                        chatDiv.innerHTML = `<div class="flex-1 flex items-center justify-center h-full">\n                            <h1 class="text-center text-primary/65 font-bold text-4xl">Ping Pong<br>Chat</h1>\n                        </div>`;
                    }

                    contactsSide?.classList.remove("hidden");
                    chat?.classList.remove("hidden");
                    chat?.classList.add("flex");
                    document.getElementById("dropdownMenu")?.classList.add("hidden");
                })();
            }
        });
        if (blockConfirmationDiv) blockConfirmationDiv.classList.add("hidden");
        
    });

    // cancel: just hide modal
    cancelBlockBtn?.addEventListener("click", () => {
        if (blockConfirmationDiv) blockConfirmationDiv.classList.add("hidden");
    });
    const contactsListDiv = document.querySelector('#contacts_side .space-y-4') as HTMLElement | null;

    
    setChatUIState(false);
    

    let PENDING_CHAT_USER_ID: string | null = null;
    // support SPA opener: other pages can set `openChatUser` in localStorage
    try {
        const pendingFromStorage = localStorage.getItem('openChatUser');
        if (pendingFromStorage) {
            PENDING_CHAT_USER_ID = pendingFromStorage;
            localStorage.removeItem('openChatUser');
        }
    } catch (e) { /* ignore storage errors */ }

    const debouncedSearch = debounce((query: string) => {
        if (!query.trim()) {
            if (contactsListDiv) {
                fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
                    attachContactClickListeners(contactsListDiv, handleContactSelect);
                    applyPresenceToRenderedContacts();

                });
            }
        

            return;
        }

        searchUsers(query, API_BASE_URL, CURRENT_USER_ID, (results) => {
            if (contactsListDiv) {
                renderSearchResults(results, contactsListDiv);
                attachContactClickListeners(contactsListDiv, handleContactSelect);
                applyPresenceToRenderedContacts();

            }
        });
    }, 250);


    //

   
    searchInput?.addEventListener('input', (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        debouncedSearch(value);
    });

   
    const handleContactSelect = (contactId: string | number, username: string, avatar: string, status: string) => {
        ACTIVE_CHAT_CONTACT_ID = contactId;
        setChatUIState(true);
        setActiveChatUser(String(contactId));

        //clear unread
        updateUnreadBadge(contactId, false);

        // save in case of refresh
        localStorage.setItem('activeContactId', String(contactId));
        localStorage.setItem('activeContactUsername', username);
        // normalize and store the contact avatar
                const normAvatar = resolveChatAvatar(avatar);
        localStorage.setItem('activeContactAvatar', normAvatar);
        localStorage.setItem('activeContactStatus', status);

        if (window.innerWidth < 768) {
            contactsSide?.classList.add("hidden");
        } else {
            contactsSide?.classList.remove("hidden");
        }
        chat?.classList.remove("hidden");
        chat?.classList.add("flex");

       
        updateChatHeader(chatUsername, chatStatus, chatAvatar, username, status, normAvatar);

        // check if contact is blocked and update UI 
        checkIfBlocked(String(CURRENT_USER_ID), String(contactId), (isBlocked) => {
            if (isBlocked) {
                showBlockedMessage();
            } else {
                showMessageInput();
            }
            setBlockButtonUI(Boolean(isBlocked));
        });

    
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            contactsSide?.classList.add("hidden");
            chat?.classList.remove("hidden");
            chat?.classList.add("flex");
        }

        //check messages panel is visible on mobile when opening a chat
        const messagesPanelEl = document.getElementById("messagesPanel");
        if (messagesPanelEl) {
            messagesPanelEl.classList.remove("hidden");
        }


        //fetch user profileimage

        //FETCH MESSAGES AND RENDER THEM 
        const messagePanel = document.getElementById("messagesPanel") as HTMLElement | null;
        if (messagePanel) {
            messagePanel.innerHTML = "";
            const userId1 = String(CURRENT_USER_ID);
            const userId2 = String(contactId);
            
            //fetch history with Authorization header so server can resolve avatars
            const tokenForFetch = localStorage.getItem('token') || '';
            fetch(`${API_BASE_URL}/chats/history/${userId1}/${userId2}`, {
                headers: {
                    'Authorization': tokenForFetch
                }
            })
                .then(response => response.json())
                .then(async data => {
                    const messages = data?.messages || [];
                    
                    messages.forEach((msg: any) => {
                        if (msg.senderAvatar) {
                            try {
                                const fixedMsgAvatar = resolveChatAvatar(msg.senderAvatar);
                                msg.senderAvatar = fixedMsgAvatar;
                                try { sessionStorage.setItem('avatar:' + String(msg.sender_id), fixedMsgAvatar); } catch (e) {}
                            } catch (e) {}
                        }

                        const isSenderMe = String(msg.sender_id) === String(userId1);

                        const avatarToUse = isSenderMe
                            ? CURRENT_USER_AVATAR
                            : resolveChatAvatar(
                                localStorage.getItem('activeContactAvatar')
                                || sessionStorage.getItem('avatar:' + String(msg.sender_id))
                                || msg.senderAvatar
                                || '/default.png'
                            );

                        renderSingleMessage(msg, isSenderMe, messagePanel, CURRENT_USER_AVATAR, avatarToUse);
                    });
                })
                .catch(error => {
                    console.error("Error fetching chat history:", error);
                });
        }
    };

    //  open a conversation for a given user id from friends
   
    async function openConversationWith(userId: string | null) {
        if (!userId) return;
        // prefer the already-rendered contact element
        try {
            if (contactsListDiv) {
                const contactEl = contactsListDiv.querySelector(`[data-contact-id="${userId}"]`) as HTMLElement | null;
                if (contactEl) {
                    const username = contactEl.getAttribute('data-contact-username') || String(userId);
                    const avatar = contactEl.getAttribute('data-contact-avatar') || '/default.png';
                    const status = contactEl.getAttribute('data-contact-status') || 'offline';
                    handleContactSelect(userId, username, avatar, status);
                    return;
                }
            }
        } catch (e) {
            console.warn('openConversationWith => failed to find rendered contact', e);
        }

        // fetch user profile 
        try {
            const tokenFetch = localStorage.getItem('token') || '';
            const res = await fetch(`${API_BASE_URL}/users/${String(userId)}`, { headers: { Authorization: tokenFetch } });
            if (res && res.ok) {
                const json = await res.json();
                const username = json?.userName || json?.username || String(userId);
                const img = json?.profileImage || json?.profile_image || null;
                const avatar = resolveChatAvatar(img) || '/default.png';
                const status = 'offline';
                handleContactSelect(userId, username, avatar, status);
                return;
            }
        } catch (e) {
            console.warn('openConversationWith: failed to fetch user', e);
        }

    //open chat with minimal info
        try { handleContactSelect(userId, String(userId), '/default.png', 'offline'); } catch (e) {}
    }

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
            // on mobile: show contacts hide chat
            if (isMobile) {
                contactsSide?.classList.remove("hidden");
                chat?.classList.add("hidden");
                chat?.classList.remove("flex");
                // hide messages panel on mobile when returning to contacts
                document.getElementById("messagesPanel")?.classList.add("hidden");
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

    
    if (contactinfo) {
        contactinfo.addEventListener('click', async () => {
            const contactId = localStorage.getItem('activeContactId') || String(ACTIVE_CHAT_CONTACT_ID || '');
            if (!contactId) return;

            const cachedUser: any = {
                id: contactId,
                userName: localStorage.getItem('activeContactUsername') || '',
                profileImage: localStorage.getItem('activeContactAvatar') || '/default.png',
                firstName: '',
                lastName: ''
            };
            try { await viewFriendProfile(cachedUser); } catch (err) { console.warn('viewFriendProfile (cached) failed', err); }

            const tokenFetch = localStorage.getItem('token') || '';
            try {
                const res = await fetch(`${API_BASE_URL}/users/${contactId}`, { headers: { Authorization: tokenFetch } });
                if (res.ok) {
                    const fullUser = await res.json();
                    try { await viewFriendProfile(fullUser); } catch (err) { console.warn('viewFriendProfile (full) failed', err); }
                }
            } catch (err) {
                console.warn('failed fetching full user', err);
            }

            dropdownMenu?.classList.add('hidden');
        });
    }

        // check if blocked to setblocked button state
        try {
            const persisted = localStorage.getItem('activeContactId');
            if (persisted && CURRENT_USER_ID) {
                checkIfBlocked(String(CURRENT_USER_ID), String(persisted), (isBlocked) => {
                    setBlockButtonUI(Boolean(isBlocked));
                    if (isBlocked) showBlockedMessage();
                });
            }
        } catch (e) {}


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
            // hide messages panel when closing the chat (mobile)
            document.getElementById("messagesPanel")?.classList.add("hidden");
            document.getElementById("messageInputContainer")?.classList.add("hidden");
            document.getElementById("dropdownMenu")?.classList.add("hidden");
        });
    }

   
    if (contactsListDiv) {
        fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
            attachContactClickListeners(contactsListDiv, handleContactSelect);
            applyPresenceToRenderedContacts();
            // register friend-accepted listener after contacts list exists
            try {
                listenForFriendAccepted(() => {
                    console.log(" FETCH CONTACTS TRIGGERED");
                    // re-fetch contacts when a friend is accepted
                    fetchContacts(API_BASE_URL, CURRENT_USER_ID, contactsListDiv, () => {
                        attachContactClickListeners(contactsListDiv, handleContactSelect);
                        applyPresenceToRenderedContacts();
                    });
                });
            } catch (e) { console.warn('listenForFriendAccepted setup failed', e); }
        });


        //  auto-open chat if redirected with ?user=
        if (PENDING_CHAT_USER_ID) {
            // contact items are rendered with `data-contact-id` and related attrs
            const contactEl = contactsListDiv.querySelector(
                `[data-contact-id="${PENDING_CHAT_USER_ID}"]`
            ) as HTMLElement | null;

            if (contactEl) {
                const username = contactEl.getAttribute("data-contact-username") || "";
                const avatar = contactEl.getAttribute("data-contact-avatar") || "/default.png";
                const status = contactEl.getAttribute("data-contact-status") || "offline";

                handleContactSelect(
                    PENDING_CHAT_USER_ID,
                    username,
                    avatar,
                    status
                );

                PENDING_CHAT_USER_ID = null;
            } else {
                // contact not rendered  try 
                openConversationWith(PENDING_CHAT_USER_ID).catch((e) => console.warn('auto open fallback failed', e));
                PENDING_CHAT_USER_ID = null;
            }
        }
        
    } else {
        console.error('Cannot fetch contacts - contactsListDiv is null');
    }

    



    //socket eventhandlers
    const messageInput =document.getElementById("messageInput") as HTMLInputElement | null;
    const sendButton = document.getElementById("sendMessageBtn");
    const messagesPanel = document.getElementById("messagesPanel");
    

    const handleSendMessage = async () => {
        const content = messageInput?.value.trim();
        if(!content || !ACTIVE_CHAT_CONTACT_ID) return;
        
        
        // optimistic render: show message immediately in UI
            try {
                let friendAvatar = localStorage.getItem('activeContactAvatar')
                            || (ACTIVE_CHAT_CONTACT_ID ? sessionStorage.getItem('avatar:' + String(ACTIVE_CHAT_CONTACT_ID)) : null)
                            || null;
            friendAvatar = friendAvatar || '/default.png';
            const optimisticMsg: any = {
                content,
                sender_id: String(CURRENT_USER_ID),
                created_at: Math.floor(Date.now() / 1000)
            };

            const isForActiveChat = Boolean(ACTIVE_CHAT_CONTACT_ID);

            if (isForActiveChat && messagesPanel) {
                renderSingleMessage(optimisticMsg, true, messagesPanel, CURRENT_USER_AVATAR, resolveChatAvatar(friendAvatar) || '/default.png');
            }

            updateContactLastMessage(String(ACTIVE_CHAT_CONTACT_ID),{content,created_at: Math.floor(Date.now() / 1000)});
            

           

        } catch (e) { console.warn('optimistic render failed', e); }

        // send to server (ack used only for error handling, do not re-render on ack)
        sendMessage(ACTIVE_CHAT_CONTACT_ID, content, (res) => {
            if(res?.status === "error") {
                console.debug("send failed", res?.reason || "unknown");
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

    listenForMessagesReceived(async (data) => {
        const msg = data?.message;
        const convo = data?.conversation;
        if (!msg) return;

        // normalize & cache sender avatar so fresh tabs can use it
        if (msg.senderAvatar) {
            try {
                const fixed = resolveChatAvatar(msg.senderAvatar);
                msg.senderAvatar = fixed;
                try { sessionStorage.setItem('avatar:' + String(msg.sender_id), fixed); } catch (e) {}
            } catch (e) {}
        }

        const otherId = convo ? (String(convo.user_a) === String(CURRENT_USER_ID) ? String(convo.user_b) : String(convo.user_a)) : null;
        const isForActiveChat = (String(msg.sender_id) === String(ACTIVE_CHAT_CONTACT_ID)) || (otherId && String(otherId) === String(ACTIVE_CHAT_CONTACT_ID));

        if(otherId) {
            updateContactLastMessage(otherId, msg);
        }
        if(!isForActiveChat && otherId)
            updateUnreadBadge(otherId, true);
        if (messagesPanel && isForActiveChat && ACTIVE_CHAT_CONTACT_ID) {
            const isSenderMe = String(msg.sender_id) === String(CURRENT_USER_ID);

            const raw =
                localStorage.getItem('activeContactAvatar')
                || sessionStorage.getItem('avatar:' + String(msg.sender_id))
                || msg.senderAvatar
                || '/default.png';

            const avatarToUse = isSenderMe
                ? CURRENT_USER_AVATAR
                : (resolveChatAvatar(raw) || '/default.png');

            renderSingleMessage(msg, isSenderMe, messagesPanel, CURRENT_USER_AVATAR, avatarToUse);
        }
    });


    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user");

    if (userId) {
    // openConversationWith(userId);
        PENDING_CHAT_USER_ID = userId;


    }


}
