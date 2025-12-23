import { showAlert } from "../utils/alert";

export async function blockUser(id: string, removeCard: () => void) {
    const token = localStorage.getItem("token");
    if (!token)
        return ;
    try {
        const res = await fetch(`http://localhost:3002/block`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ blockedId: id })
        });
        showAlert("User blocked successfully", "success");
        removeCard();
    }
    catch (err) {
        showAlert("Error: " + err)
    }
}

export async function unblockUser(id: string, removeCard: () => void) {
    const token = localStorage.getItem("token");
    if (!token)
        return ;
    try {
        const res = await fetch(`http://localhost:3002/unblock`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ blockedId: id})
        });
        showAlert("User unblocked successfully", "success");
        removeCard();
    }
    catch (err) {
        showAlert("Error: " + err)
    }
}

export async function addFriend(id: string, removeCard: () => void) {
    const token = localStorage.getItem("token");
    if (!token)
        return ;
    try {
        const res = await fetch(`http://localhost:3002/friends/request`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ to: id})
        });
        showAlert("Invitation sent", "success")
        removeCard();
    }
    catch (err) {
        showAlert("Error: " + err)
    }
}

export async function acceptInvitation(id: string, removeCard: () => void) {
    const token = localStorage.getItem("token");
    if (!token)
        return ;
    try {
        const res = await fetch(`http://localhost:3002/friends/accept`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ from: id})
        });
        showAlert("Friendship accepted", "success")
        removeCard();
    }
    catch (err) {
        showAlert("Error: " + err)
    }
}

export async function cancelRequest(id: string, removeCard: () => void) {
    const token = localStorage.getItem("token");
    if (!token)
        return ;
    try {
        const res = await fetch(`http://localhost:3002/friends/cancel`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ request_id: id})
        });
        showAlert("Request canceled", "success")
        removeCard();
    }
    catch (err) {
        showAlert("Error: " + err)
    }
}