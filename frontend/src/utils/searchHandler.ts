
//  search and contacts management
 

export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 250) {
    let t: number | undefined;
    return (...args: Parameters<T>) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), wait) as unknown as number;
    };
}

export function searchUsers(
    q: string,
    API_BASE_URL: string,
    CURRENT_USER_ID: number,
    onResults: (users: any[]) => void
): void {
    if (!q || q.trim().length === 0) {
        return;
    }

    fetch(`${API_BASE_URL}/chats/search/${CURRENT_USER_ID}?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((friends) => {
            if (friends.length > 0) {
                onResults(friends);
            } else {
                // If no friends match, search all users
                return fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(q)}&userId=${CURRENT_USER_ID}`)
                    .then((userRes) => userRes.json())
                    .then((users) => onResults(users));
            }
        })
        .catch((err) => {
            console.error('search error', err);
        });
}

export function renderSearchResults(
    users: Array<{ id: number; username: string; avatar: string; status: string }>,
    contactsListDiv: HTMLElement
): void {
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
}

export function fetchContacts(
    API_BASE_URL: string,
    CURRENT_USER_ID: number,
    contactsListDiv: HTMLElement,
    onComplete?: () => void
): void {
    fetch(`${API_BASE_URL}/chats/contacts/${CURRENT_USER_ID}`)
        .then((res) => res.json())
        .then((contacts: any[]) => {
            contactsListDiv.innerHTML = contacts.map((contact: any) => {
                const statusClass = contact.status === 'online' ? 'bg-greenAdd' : 'bg-redRemove';
                const lastMessage = contact.last_message || 'No messages yet.';
                const contactAvatar = contact.avatar || '../../public/default.svg';
                
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
            
            if (onComplete) onComplete();
        })
        .catch((err) => {
            console.error('Error fetching contacts:', err);
        });
}
