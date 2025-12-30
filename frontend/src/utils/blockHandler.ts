import { socket } from "./sockeService.ts";
const API_BASE = window.location.origin.replace(/\/$/, "");

export function checkIfBlocked(blockerId: number | string, blockedId: number | string, callback: (isBlocked: boolean) => void) {
    // validate ids
    if (blockerId == null || blockedId == null) return callback(false);
    const b1 = String(blockerId);
    const b2 = String(blockedId);
    const token = localStorage.getItem('token') || '';
    fetch(`${API_BASE}/api/is-blocked/${encodeURIComponent(b1)}/${encodeURIComponent(b2)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => callback(Boolean(data.isBlocked)))
        .catch(error => {
            console.error("Error check if blocked:", error);
            callback(false);
        });
}

export function showBlockedMessage(){
    //hide message input area 
    const messageInputDiv = document.getElementById('messageInputContainer') as HTMLElement;
   if(messageInputDiv){
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
        console.log('[frontend] blockUser payload:', { blockedId }, 'tokenPresent:', !!token);

        // then the existing fetch...
        const res = await fetch(`${API_BASE}/api/block`, {
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
        console.log('User blocked successfully:', data);
        showBlockedMessage();
        try {
            if (socket && socket.connected) {
                socket.emit('user_blocked', { blockedId, blockerId });
            }
        } catch (e) {
            console.warn('failed to emit user_blocked', e);
        }
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
        const res = await fetch(`${API_BASE}/api/unblock`, {
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
        console.log('User unblocked successfully:', data);
        showMessageInput();
        if (socket && socket.connected) {
        socket.emit('user_unblocked', { unblockedId: blockedId, unblockedBy: blockerId });
        }
    } catch (error) {
        console.error('Error unblocking user failed:', error);
    }
}

// const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

// async function handleJson(response) {
//   const text = await response.text();
//   let payload = {};
//   try {
//     payload = text ? JSON.parse(text) : {};
//   } catch {
//     payload = { raw: text };
//   }
//   if (!response.ok) {
//     const err = new Error(payload?.error || response.statusText || `HTTP ${response.status}`);
//     err.status = response.status;
//     err.payload = payload;
//     throw err;
//   }
//   return payload;
// }

// export async function block(authHeader, blockerId, blockedId) {
//   const response = await fetch(`${REL_SERVICE_URL}/block`, {
//     method: 'POST',
//     headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
//     body: JSON.stringify({ blockedId })
//   });
//   return handleJson(response);
// }

// export async function unblock(authHeader, blockerId, blockedId) {
//   const response = await fetch(`${REL_SERVICE_URL}/unblock`, {
//     method: 'POST',
//     headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
//     body: JSON.stringify({ blockedId })
//   });
//   return handleJson(response);
// }

// export async function isBlocked(authHeader, blockerId, blockedId) {
//   try {
//     const response = await fetch(`${REL_SERVICE_URL}/is-blocked/${blockerId}/${blockedId}`, {
//       headers: { Authorization: authHeader }
//     });
//     const data = await response.json();
//     return data.isBlocked || false;
//   } catch {
//     return false;
//   }
// }
