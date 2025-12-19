
// Search and contacts management

export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 250) => {
    let t: number;
    return (...args: Parameters<T>) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
};

// Render contact item HTML
const renderContactItem = (u: any, lastMsg = 'Search result') => {
    const statusClass = u.status === 'online' ? 'bg-greenAdd' : 'bg-redRemove';
    const avatar = u.avatar || '../../public/default.svg';
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
                <p class="font-medium text-sm text-secondary">${u.username}</p>
                <p class="text-xs text-gray-200 truncate max-w-[200px]">
                ${lastMsg}</p>
            </div>
        </div>
    `;
};

// render users to contact list
const renderToList = (users: any[], div: HTMLElement, getLastMsg = (u: any) => 'Search result') => {
    div.innerHTML = users.map(u => renderContactItem(u, getLastMsg(u))).join('');
};

export const searchUsers = (q: string, API_BASE_URL: string, CURRENT_USER_ID: number, onResults: (users: any[]) => void) => {
    if (!q?.trim()) return;
    
    fetch(`${API_BASE_URL}/chats/search/${CURRENT_USER_ID}?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(friends => {
            if (friends.length > 0) return onResults(friends);
            return fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(q)}&userId=${CURRENT_USER_ID}`)
                .then(res => res.json())
                .then(users => onResults(users));
        })
        .catch(err => console.error('search error', err));
};

export const renderSearchResults = (users: any[], div: HTMLElement) => {
    renderToList(users, div);
};

export const fetchContacts = (API_BASE_URL: string, CURRENT_USER_ID: number, div: HTMLElement, onComplete?: () => void) => {
    fetch(`${API_BASE_URL}/chats/contacts/${CURRENT_USER_ID}`)
        .then(res => res.json())
        .then(contacts => {
            renderToList(contacts, div, c => c.last_message || 'No messages yet.');
            onComplete?.();
        })
        .catch(err => console.error('Error fetching contacts:', err));
};
