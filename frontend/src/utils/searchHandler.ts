
// search and contacts management

export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 250) => {
    let t: number;
    return (...args: Parameters<T>) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
};

// render contact item HTML
const renderContactItem = (u: any, lastMsg = 'Search result') => {
    const status = u?.status || 'offline';
    const statusClass = status === 'online' ? 'bg-greenAdd' : 'bg-redRemove';
    const avatar = u?.avatar || 'default.svg';
    const displayName = (u?.username && String(u.username).trim())
        ? u.username
        : (typeof u?.id === 'string' ? String(u.id).trim().slice(0, 8) : String(u?.id ?? 'Unknown'));
        const timeStr = u?.last_message_time 
        ? new Date(u.last_message_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
        return `
        <div class="scroll flex items-center gap-4 cursor-pointer hover:bg-primary/65 p-2 rounded contact-item"
             data-contact-id="${u.id}"
             data-contact-username="${displayName}"
             data-contact-avatar="${avatar}"
             data-contact-status="${status}">
            <div class="relative w-12 h-12 flex-shrink-0">
                <img src="${avatar}" class="w-12 h-12 object-cover border border-primary rounded-full">
                <div id="status-${u.id}" class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusClass}"></div>
            </div>
            <div>
                <p class="font-medium text-sm text-secondary">${displayName}</p>
                <p class="text-xs text-gray-200 truncate max-w-[200px]">
                ${lastMsg}</p>
                 <span class="text-xs text-gray-400">${timeStr}</span>
            </div>
        </div>
    `;
};

// render users to contact list
const renderToList = (users: any[], div: HTMLElement, getLastMsg = (u: any) => 'Search result') => {
    if (!Array.isArray(users)) {
        console.error('renderToList: expected users array but got:', users);
        return;
    }
    console.log('renderToList: rendering', users.length, 'users');
    if (users.length > 0) {
        try { console.log('First user sample:', JSON.stringify(users[0]).substring(0, 150)); } catch (e) {}
    }
    const html = users.map(u => renderContactItem(u, getLastMsg(u))).join('');
    console.log('generated HTML length:', html.length);
    div.innerHTML = html;
    console.log('Div innerHTML set, now contains:', div.querySelectorAll('.contact-item').length, 'contact-item elements');
};

export const searchUsers = (q: string, API_BASE_URL: string, CURRENT_USER_ID: string | number, onResults: (users: any[]) => void) => {
    if (!q?.trim()) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/chats/search/${CURRENT_USER_ID}?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(friends => {
            if (friends.length > 0) return onResults(friends);
            return fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(q)}&userId=${CURRENT_USER_ID}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(users => onResults(users));
        })
        .catch(err => console.error('search error', err));
};

export const renderSearchResults = (users: any[], div: HTMLElement) => {
    renderToList(users, div);
};

export const fetchContacts = (API_BASE_URL: string, CURRENT_USER_ID: string | number, div: HTMLElement, onComplete?: () => void) => {
    console.log('fetchContacts: user=', CURRENT_USER_ID, 'div exists=', !!div);
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/chats/contacts/${CURRENT_USER_ID}`;
    console.log('fetching from:', url);
    
    fetch(url, {
         headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(async (res) => {
            console.log('fetchContacts response status:', res.status, 'url:', url);
            const text = await res.text().catch(() => null);
            console.log('fetchContacts raw body:', text);
            let contacts: any = null;
            try {
                contacts = text ? JSON.parse(text) : null;
            } catch (e) {
                console.error('fetchContacts JSON parse error', e);
                contacts = null;
            }
            if (!contacts) {
                console.warn('fetchContacts: received no contacts, returning empty list');
                renderToList([], div, c => c.last_message || 'No messages yet.');
                onComplete?.();
                return;
            }
            console.log('received', Array.isArray(contacts) ? contacts.length : typeof contacts, 'contacts');
            renderToList(contacts, div, c => c.last_message || 'No messages yet.');
            onComplete?.();
        })
        .catch(err => console.error('Error fetching contacts:', err));
};
