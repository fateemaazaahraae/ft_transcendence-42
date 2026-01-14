import { socket } from "./sockeService.ts";


const HOST = window.location.hostname;
const PROTO = window.location.protocol;
const API_BASE = (PROTO === 'https:') ? `${window.location.origin}/api` : `${PROTO}//${HOST}:4000/api`;

export function checkIfBlocked(blockerId: number | string, blockedId: number | string, callback: (isBlocked: boolean) => void) {
    // validate ids
    if (blockerId == null || blockedId == null) return callback(false);
    const b1 = String(blockerId);
    const b2 = String(blockedId);
    const token = localStorage.getItem('token') || '';
    fetch(`${API_BASE}/is-blocked/${encodeURIComponent(b1)}/${encodeURIComponent(b2)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => callback(Boolean(data.isBlocked)))
        .catch(error => {
            console.error("Error check if blocked:", error);
            callback(false);
        });
}

export function showBlockedMessage(hideInput: boolean = true){
    // hide message input area only when requested 
    const messageInputDiv = document.getElementById('messageInputContainer') as HTMLElement;
   if(messageInputDiv && hideInput){
        messageInputDiv.classList.add('hidden');
    }
    const blockedDiv=document.getElementById('blockeddiv');
    if(blockedDiv)
    {
        blockedDiv.classList.remove('hidden');
    }
    //close dropdownmenu
    const  dropdown=document.getElementById('dropdownMenu');
    if(dropdown)
    {
        dropdown.classList.add('hidden');
    }
}

export async function blockUser(blockerId: number | string, blockedId: number | string) {
    if (blockedId == null) {
        console.error('blockUser: missing blockedId');
        return;
    }
    const token = localStorage.getItem('token') || '';
    try {
        

        // then the existing fetch
        const res = await fetch(`${API_BASE}/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ blockedId })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.error('blockUser failed', res.status, data);
            return;
        }
        
        showBlockedMessage();
        // realtime notifications are handled by server-side controller
    } catch (error) {
        console.error('Error blocking user failed:', error);
    }
}

export function showMessageInput()
{
    const messageInputDiv = document.getElementById('messageInputContainer') as HTMLElement;
    if (messageInputDiv) {
        messageInputDiv.classList.remove('hidden');
    }

    //hide blocked message
    const blockedDiv = document.getElementById('blockeddiv');
    if (blockedDiv) {
        blockedDiv.classList.add('hidden');
    }
}
export async function unblockUser(blockerId: number | string, blockedId: number | string) {
    if (blockedId == null) {
        console.error('unblockUser: missing blockedId');
        return;
    }
    const token = localStorage.getItem('token') || '';
    try {
        const res = await fetch(`${API_BASE}/unblock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ blockedId })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.error('unblockUser failed', res.status, data);
            return;
        }
        
        showMessageInput();
        // realtime notifications are handled by server-side controller
    } catch (error) {
        console.error('Error unblocking user failed:', error);
    }
}
