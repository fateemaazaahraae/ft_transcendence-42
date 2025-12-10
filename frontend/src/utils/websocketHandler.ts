//--websocket handler for messages

export let chatWebSocket: WebSocket | null = null;

export function connectWS(userId: number, WS_URL: string, onMessageCallback: (data: any) => void): void {
    if (chatWebSocket) chatWebSocket.close();
    
    chatWebSocket = new WebSocket(`${WS_URL}?user_id=${userId}`);
    
    chatWebSocket.onopen = (): void => console.log("WebSocket connected.");
    
    chatWebSocket.onmessage = (event: MessageEvent): void => {
        const data = JSON.parse(event.data);
        onMessageCallback(data);
    };
    
    chatWebSocket.onclose = (): void => {
        console.log("WebSocket disconnected. Attempting to reconnect in 5s...");
        setTimeout(() => connectWS(userId, WS_URL, onMessageCallback), 5000);
    };
    
    chatWebSocket.onerror = (e: Event): void => console.error("WS Error:", e);
}

export function sendMessage(receiverId: number, content: string): void {
    if (content && chatWebSocket && chatWebSocket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'chat',
            receiver_id: receiverId,
            content: content
        };
        chatWebSocket.send(JSON.stringify(message));
    } else {
        console.warn('Cannot send message: WebSocket not ready or no active chat.');
    }
}
