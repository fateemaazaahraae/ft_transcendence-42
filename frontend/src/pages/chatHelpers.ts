
export function updateContactStatusUI(userId: string | number, status: string): void {
    const statusElement = document.getElementById(`status-${userId}`);
    if (statusElement) {
        statusElement.className = `absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            status === 'online' ? 'bg-greenAdd' : 'bg-redRemove'
        }`;
    }
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
    menuToggle.addEventListener("click", (): void => {
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

// export function appendMessageToChat()
// {

// }

export function renderSingleMessage(message:{ 
  content:string;  sender_id :number;receiver_id:number;createdAt:number},
  isSender:boolean,
  messagesPanel:HTMLElement,
    currentUserAvatar:string,
    friendAvatar:string
):void
{
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`;

    const timeStr = new Date((message as any).created_at ? ((message as any).created_at as number) * 1000 : Date.now()).toLocaleTimeString();

        if (isSender) {
        messageDiv.innerHTML = `
            <div class="flex flex-col items-end mb-4 w-full">
                <div class="flex items-end gap-2">
                    <div class="bg-primary/65 text-sm p-3 rounded-xl rounded-tr-none max-w-[250px] break-words text-white">
                    ${message.content || ""}
                    </div>
                    <img src="${currentUserAvatar}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0">
                </div>
                <p class="text-[10px] opacity-70 mt-1 mr-12">${timeStr}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex flex-col items-start mb-4 w-full">
                <div class="flex items-end gap-2">
                    <img src="${friendAvatar}" class="w-12 h-12 object-cover border border-primary rounded-full flex-shrink-0">
                    <div class="bg-primary/20 text-white text-sm p-3 rounded-xl rounded-tl-none  max-w-[250px] break-words">
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
   
// <div class="${isSender ? 'bg-primary' : 'bg-primary/20 text-white'} max-w-[70%] px-4 py-2 rounded-3xl px-4 py-2 max-w-xs">
// <p class="text-sm break-words">${message.content || ""}</p>
// </div>
// <div class="ml-2 flex flex-col items-center">
// <p class="text-xs opacity-70 mt-1">${new Date((message as any).created_at ? ((message as any).created_at as number) * 1000 : Date.now()).toLocaleTimeString()}</p>
// </div>
