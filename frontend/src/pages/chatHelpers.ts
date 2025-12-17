
export function updateContactStatusUI(userId: number, status: string): void {
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
  messagesPanel:HTMLElement
):void
{
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`;
    messageDiv.innerHTML = `
        <div class="${isSender ? 'bg-primary' : 'bg-primary/20 text-white'} max-w-[70%] px-4 py-2 rounded-lg px-4 py-2 max-w-xs">
        <p class="text-sm break-words">${message.content || ""}</p>
        <p class="text-xs opacity-70 mt-1">${new Date((message as any).created_at ? ((message as any).created_at as number) * 1000 : Date.now()).toLocaleTimeString()}</p>
    </div>
  `;
    messagesPanel.appendChild(messageDiv);
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
              }