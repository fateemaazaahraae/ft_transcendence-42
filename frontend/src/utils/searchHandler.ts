
// search and contacts management

export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 250) => {
    let t: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(t as any);
        t = setTimeout(() => fn(...args), wait);
    };
};


const renderContactItem = (u: any, lastMsg = 'Search result', hideStatus = false) => {
    const status = u?.status || 'offline';

    // hide status dot for blocked contacts 
    const statusClass = (hideStatus || u?.isBlocked) ? 'hidden' : (status === 'online' ? 'bg-greenAdd' : 'bg-redRemove');
    
    const avatar = u?.avatar || 'default.svg';

    const displayName = (u?.username && String(u.username).trim())
        ? u.username
        : (typeof u?.id === 'string' ? String(u.id).trim().slice(0, 8) : String(u?.id ?? 'Unknown'));
        const timeStr = u?.last_message_time 
        ? new Date(u.last_message_time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        : '';
        //    const blockedBadge = u?.isBlocke
           return `
           <div class="scroll flex items-center gap-4  hover:bg-primary/65  p-2 rounded-xl contact-item"
               data-contact-id="${u.id}"
               data-contact-username="${displayName}"
               data-contact-avatar="${avatar}"
               data-contact-status="${status}"
               data-contact-isblocked="${u?.isBlocked ? '1' : '0'}">
            <div class="relative w-12 h-12 flex-shrink-0">
                <img src="${avatar}" class="w-12 h-12 object-cover border border-primary rounded-full">
                <div id="status-${u.id}" class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusClass}"></div>
            </div>
            <div class="w-full flex flex-col">
                <div class="flex items-center gap-2">
                    <p class="font-medium text-sm text-secondary truncate">
                        ${displayName}
                    </p>
                    <div class="ml-auto flex items-start">
                        ${(() => {
                            const ucount = (typeof u?.unread === 'number') ? u.unread : (typeof u?.unread_count === 'number' ? u.unread_count : 0);
                            const badgeClass = ucount > 0 ? '' : 'hidden';
                            const badgeText = ucount > 0 ? String(ucount) : '';
                            return `<span class="unread-badge ${badgeClass} bg-red-500 text-white text-[10px] rounded-full px-2 py-[2px] self-start" data-unread="${badgeText}">${badgeText}</span>`;
                        })()}
                    </div>
                </div>

                <div class="flex items-end w-full mt-1">
                    <p class="last-message text-xs text-gray-200 truncate">
                        ${lastMsg}
                    </p>
                    <div class="ml-auto flex items-end gap-2">
                        <span class="last-message-time text-[11px] text-gray-400 self-end">
                            ${timeStr}
                        </span>
                    </div>
                </div>
            </div>
    `;
};

// render users to contact list
const renderToList = (users: any[], div: HTMLElement, getLastMsg = (u: any) => 'Search result', hideStatus = false) => {
    if (!Array.isArray(users)) {
        console.error('renderToList: expected users array but got:', users);
        return;
    }
    
    if (users.length > 0) {
        try { /* no-op debug removed */ } catch (e) {}
    }
    const html = users.map(u => renderContactItem(u, getLastMsg(u), hideStatus)).join('');
    div.innerHTML = html;
    // restore  unread counts
    try {
        users.forEach(u => {
            try {
                const badge = div.querySelector(`.contact-item[data-contact-id="${u.id}"] .unread-badge`) as HTMLElement | null;
                if (!badge) return;
                const saved = localStorage.getItem(`unread:${String(u.id)}`);
                if (saved != null) {
                    const n = parseInt(saved, 10) || 0;
                    badge.dataset.unread = String(n);
                    badge.textContent = String(n);
                    if (n > 0) badge.classList.remove('hidden'); else badge.classList.add('hidden');
                }
            } catch (e) {}
        });
    } catch (e) {}
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
    // hide status dot when rendering search results
    renderToList(users, div, (u: any) => 'Search result', true);
};

export const fetchContacts = (API_BASE_URL: string, CURRENT_USER_ID: string | number, div: HTMLElement, onComplete?: () => void) => {
    
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/chats/contacts`;
    
    
    fetch(url, {
         headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(async (res) => {
            
            const text = await res.text().catch(() => null);
            
            let contacts: any = null;
            contacts = text ? JSON.parse(text) : null;
           
            if (!contacts) {
                console.warn('fetchContacts: received no contacts, returning empty list');
                renderToList([], div, c => c.last_message || 'No messages yet.');
                onComplete?.();
                return;
            }
            
            renderToList(contacts, div, c => c.last_message || 'No messages yet.');
            onComplete?.();
        })
        .catch(err => console.error('Error fetching contacts:', err));
};


