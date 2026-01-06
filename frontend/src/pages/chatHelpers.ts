 
const pendingPresence = new Map<string, "online" | "offline">();

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

    const myAvatar = (currentUserAvatar && String(currentUserAvatar).trim() !== '') ? currentUserAvatar : '/green-girl.svg';
    const messageAvatar = (message as any).senderAvatar || '';
    const friendAvatarUrl = friendAvatar || messageAvatar || '/default.png';

        if (isSender) {
        messageDiv.innerHTML = `
            <div class="flex flex-col items-end mb-4 w-full pr-4">
                <div class="flex items-end gap-2">
                    <div class="flex flex-row items-end"> 
                    <div class="bg-primary/65 text-sm p-3 rounded-xl rounded-br-none max-w-[250px] break-words text-white">
                    ${message.content || ""}
                    <p class="text-[10px] opacity-70 ">${timeStr}</p>
                    </div>
                    </div>    
                    <img src="${myAvatar}" data-sender-id="${(message as any).sender_id}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0">
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex flex-col items-start mb-4 w-full pl-4">
                <div class="flex items-end gap-2">
                    <img src="${(message as any).senderAvatar ? messageAvatar : friendAvatarUrl}" data-sender-id="${(message as any).sender_id}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0">
                    <div class="bg-primary/20 text-white text-sm p-3 rounded-xl rounded-bl-none  max-w-[250px] break-words">
                    ${message.content || ""}
                    </div>
                </div>
                <p class="text-[10px] opacity-70 mt-1 ml-12">${timeStr}</p>
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

export function updateUnreadBadge(contactId: string | number, increment = true) {
    const row = document.querySelector(
        `.contact-item[data-contact-id="${String(contactId)}"]`
    ) as HTMLElement | null;

    if (!row) return;

    const badge = row.querySelector(".unread-badge") as HTMLElement | null;
    if (!badge) return;

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
    console.warn("[presence] contact not rendered yet:", userId);
    return;
  }

  // update dataset safely
  row.dataset.contactStatus = status;

  const dot = document.getElementById(`status-${userId}`);
  if (!dot) {
    console.warn("[presence] status dot not found:", userId);
    return;
  }
    // remove any known status classes (support both old and new class names)
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




