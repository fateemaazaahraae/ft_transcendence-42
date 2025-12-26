import { socket } from "./sockeService.ts";
const API_BASE = window.location.origin.replace(/\/$/, "");

export function checkIfBlocked(blockerId: number, blockedId: number, callback: (isBlocked: boolean) => void) {
    const token = localStorage.getItem('token') || '';
    fetch(`${API_BASE}/api/is-blocked/${blockerId}/${blockedId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            callback(data.isBlocked);
        })
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

export function blockUser(blockerId:number,blockedId:number){
    //send request to backend
    fetch(`${API_BASE}/api/block`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body:JSON.stringify({
            blockedId:blockedId,
            blockerId:blockerId
        })
        
    })
    .then(response => response.json())
    .then(data => {
        console.log('User blocked succesfuly:',data);
        showBlockedMessage();
        try {
        if (socket && socket.connected) {
            socket.emit('user_blocked', { blockedId, blockerId });
        }
    } catch (e) {
        console.warn('failed to emit user_blocked', e);
    }
    })
    .catch(error =>{
        console.error("Error blocking user failed:",error);
    });
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
export function unblockUser(blockerId:number,blockedId:number)
{
    fetch(`${API_BASE}/api/unblock`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body:JSON.stringify({
            blockedId:blockedId,
            blockerId:blockerId
        })
        
    })
    .then(response => response.json())
    .then(data => {
        console.log('User blocked succesfuly:',data);
        showMessageInput();
    })
    .catch(error =>{
        console.error("Error blocking user failed:",error);
    });
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
