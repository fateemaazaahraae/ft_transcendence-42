 
const pendingPresence = new Map<string, "online" | "offline">();

// Normalize avatar/image paths to a usable URL for <img src>
function resolveAvatar(img?: string | null): string {
    const origin = window.location.origin;
    if (!img) return '/default.png';
    if (/^https?:\/\//.test(img)) return img;
    if (img.startsWith('/')) return `${origin}${img}`;
    const cleaned = String(img)
        .replace(/^(?:\.\.\/|\.\/)+/, "")
        .replace(/^public\//, "")
        .replace(/^\/+/, "");
    return `${origin}/${cleaned}`.replace(/([^:]\/)\/+/, "$1");
}

let activeChatUserId: string | null = null;

export function setActiveChatUser(userId: string | null) {
    activeChatUserId = userId;
}

export function getActiveChatUser() {
    return activeChatUserId;
}

export function updateChatHeader(
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


export function attachContactClickListeners(
    contactsListDiv: HTMLElement,
    onContactSelect: (contactId: string | number, username: string, avatar: string, status: string) => void
): void {
    document.querySelectorAll(".contact-item").forEach((item: Element) => {
        item.addEventListener("click", () => {
            const htmlItem = item as HTMLElement;
            const contactId: string | number = htmlItem.getAttribute('data-contact-id') || '';
            const username: string = htmlItem.getAttribute('data-contact-username') || '';
            const avatar: string = htmlItem.getAttribute('data-contact-avatar') || '';
            const status: string = htmlItem.getAttribute('data-contact-status') || '';

            if (contactId !== '' && contactId !== null) {
                onContactSelect(contactId, username, avatar, status);
            }
        });
    });
}

export function setupMenuToggle(menuToggle: HTMLElement, dropdownMenu: HTMLElement): void {
    menuToggle.addEventListener("click", (e: MouseEvent): void => {
        try { e.stopPropagation(); } catch (err) {}
        dropdownMenu.classList.toggle("hidden");
    });
}

export function setupDropdownClose(dropdownMenu: HTMLElement): void {
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

export function setupCloseChat(closeButton: HTMLElement, onClose: () => void): void {
    closeButton?.addEventListener("click", (): void => {
        onClose();
    });
}

export function setupBackToContacts(backButton: HTMLElement, onBack: () => void): void {
    backButton?.addEventListener("click", (): void => {
        onBack();
    });
}

export function setupWindowResize(onResize: () => void): void {
    window.addEventListener("resize", (): void => {
        onResize();
    });
}


export function renderSingleMessage(message:{ 
    content:string;  sender_id :number;receiver_id:number;createdAt:number; senderAvatar?: string},
    isSender:boolean,
    messagesPanel:HTMLElement,
        currentUserAvatar:string,
        friendAvatar:string
):void
{


    
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`;

    const timeStr = new Date((message as any).created_at ? ((message as any).created_at as number) * 1000 : Date.now()).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit',hour12:false});

    const myAvatar = resolveAvatar((currentUserAvatar && String(currentUserAvatar).trim() !== '') ? currentUserAvatar : '/green-girl.svg');
    const messageAvatar = resolveAvatar((message as any).senderAvatar || '');
    const friendAvatarUrl = resolveAvatar(friendAvatar || messageAvatar || '/default.png');

        if (isSender) {
        messageDiv.innerHTML = `
            <div class="flex flex-col items-end mb-4 w-full pr-4">
                <div class="flex flex-col items-end w-auto"> 
                <div class="flex items-end gap-2">
                        <div class="bg-primary/65 text-sm p-3 rounded-xl rounded-br-none break-words text-white max-w-[250px]">
                            ${message.content || ""}
                        </div>
                        <img src="${myAvatar}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0">
                    </div>
                    
                    <p class="text-[10px] opacity-70 mt-1 self-start">${timeStr}</p>
                </div>
            </div>
        `;
    } else {
        // determine avatar to display for this incoming message
        const senderId = String((message as any).sender_id || '');
        const activeContactId = localStorage.getItem('activeContactId') || activeChatUserId || '';
        const headerAvatar = localStorage.getItem('activeContactAvatar') || '';
        const avatarSrc = (!isSender && senderId && activeContactId && String(senderId) === String(activeContactId) && headerAvatar)
            ? resolveAvatar(headerAvatar)
            : ((message as any).senderAvatar ? messageAvatar : friendAvatarUrl);

        messageDiv.innerHTML = `
            <div class="flex flex-col items-start mb-4 w-full pl-4">
                <div class="flex flex-col items-start w-auto">
                 <div class="flex items-end gap-2">
                        <img src="${avatarSrc}" data-sender-id="${(message as any).sender_id}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0 ">
                        <div class="bg-primary/20 text-white text-sm p-3 rounded-xl rounded-bl-none break-words max-w-[250px]">
                            ${message.content || ""}
                        </div>
                    </div>
                    
                    <p class="text-[10px] opacity-70 mt-1 self-end ">${timeStr}</p>
                </div>
            </div>
        `;
    }
            
    messagesPanel.appendChild(messageDiv);
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
}
   

export function updateContactLastMessage(contactId: string, msg: any) {
    const row = document.querySelector(
        `.contact-item[data-contact-id="${String(contactId)}"]`
    ) as HTMLElement | null;

    if (!row) return;

    const preview = row.querySelector(".last-message");
    const time = row.querySelector(".last-message-time");

    if (preview) preview.textContent = msg.content;
    if (time && msg.created_at) {
        time.textContent = new Date(
            msg.created_at * 1000
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    row.parentElement?.prepend(row);
}

// recent message signatures per contact used to avoid counting the same message twice
const recentMessageSignatures: Map<string, Set<string>> = new Map();

function markSignatureSeen(contactId: string | number, sig: string, ttl = 30000) {
    try {
        const key = String(contactId);
        let set = recentMessageSignatures.get(key);
        if (!set) {
            set = new Set();
            recentMessageSignatures.set(key, set);
        }
        set.add(sig);
        // schedule removal
        setTimeout(() => { set?.delete(sig); }, ttl);
    } catch (e) {}
}

function hasSeenSignature(contactId: string | number, sig: string) {
    try {
        const key = String(contactId);
        const set = recentMessageSignatures.get(key);
        return set ? set.has(sig) : false;
    } catch (e) { return false; }
}

export function updateUnreadBadge(contactId: string | number, increment = true, signature?: string) {
    const row = document.querySelector(
        `.contact-item[data-contact-id="${String(contactId)}"]`
    ) as HTMLElement | null;

    if (!row) return;

    const badge = row.querySelector(".unread-badge") as HTMLElement | null;
    if (!badge) return;

    // dedupe using signature when incrementing
    if (increment && signature) {
        if (hasSeenSignature(contactId, signature)) {
            // already counted recently
            return;
        }
        // mark as seen so duplicates won't increment
        markSignatureSeen(contactId, signature);
    }

    let count = parseInt(badge.dataset.unread || "0", 10);

    if (increment) count++;
    else count = 0;

    badge.dataset.unread = String(count);
    badge.textContent = String(count);

    if (count > 0) {
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
    try { persistUnreadCount(contactId, count); } catch (e) { console.warn('persist unread failed', e); }
}

//  store per-contact key `unread:<contactId>` in localStorage
export function persistUnreadCount(contactId: string | number, count: number) {
    try {
        const key = `unread:${String(contactId)}`;
        if (count > 0) localStorage.setItem(key, String(count));
        else localStorage.removeItem(key);
    } catch (e) {
        console.warn('persistUnreadCount failed', e);
    }
}

export function updateContactStatusUI(
  userId: string,
  status: "online" | "offline"
) {
  const row = document.querySelector(
    `.contact-item[data-contact-id="${userId}"]`
  ) as HTMLElement | null;

    if (!row) {
        pendingPresence.set(userId, status);
        return;
    }

    

  // update dataset safely
  row.dataset.contactStatus = status;

  const dot = document.getElementById(`status-${userId}`);
  if (!dot) {
    console.warn("[presence] status dot not found:", userId);
    return;
  }
    dot.classList.remove("bg-green-500", "bg-gray-400", "bg-greenAdd", "bg-redRemove");

    if (status === "online") {
        dot.classList.add("bg-greenAdd");
    } else {
        dot.classList.add("bg-redRemove");
    }
    
}

export function applyPresenceToRenderedContacts() {
    pendingPresence.forEach((status, userId) => {
        const row = document.querySelector(
            `.contact-item[data-contact-id="${userId}"]`
        );
        
        if (row) {
            updateContactStatusUI(userId, status);
            pendingPresence.delete(userId);
            
        }
    });
    }




