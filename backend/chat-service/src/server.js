// src/server.js
import fastify from 'fastify';
import websocket from 'fastify-websocket';
import cors from '@fastify/cors';
import 'dotenv/config'; 
import { openDb } from './db.js'; // Use the new openDb function
import chatRoutes from './routes/chatRoutes.js';

const onlineUsers = new Map();

const app = fastify({ logger: true });

// Register CORS
app.register(cors, {
    origin: 'https://localhost:8443', // Use your HTTPS frontend URL
    methods: ['GET', 'POST', 'DELETE'],
});

// Register WebSocket plugin
app.register(websocket);


// --- STARTUP AND DATABASE CONNECTION ---
const start = async () => {
    try {
        // Initialize DB and make it accessible to routes
        const sqliteDb = await openDb();
        app.decorate('sqliteDb', sqliteDb); // Attach DB instance to Fastify

        // Register REST API Routes
        app.register(chatRoutes, { prefix: '/api/chats' });
        
        // Start Fastify
        const port = parseInt(process.env.PORT || '3000');
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Chat Service listening on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// --- WebSocket Connection Handler ---
app.get('/ws', { websocket: true }, (connection, req) => {
    const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('user_id');

    if (!userId) {
        connection.socket.send(JSON.stringify({ type: 'error', message: 'User ID required.' }));
        return connection.socket.close(1008, 'Authentication Required');
    }
    
    onlineUsers.set(userId, connection.socket);
    
    connection.socket.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            const receiverId = data.receiver_id;
            
            if (data.type === 'chat' && receiverId && data.content) {
                const content = data.content;

                // 1. BLOCKED CHECK (New Logic)
                const db = app.sqliteDb; // Retrieve DB instance
                const isBlocked = await db.get(
                    'SELECT 1 FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
                    receiverId, userId // Check if RECEIVER has blocked SENDER
                );

                if (isBlocked) {
                    console.log(`Message from ${userId} to ${receiverId} blocked.`);
                    // Send status back to sender, but do not save or forward message
                    connection.socket.send(JSON.stringify({ type: 'status', message: `Cannot send message: ${receiverId} has blocked you.` }));
                    return;
                }

                // 2. Save message to DB
                const result = await db.run(
                    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
                    userId, receiverId, content
                );
                
                const fullMessage = {
                    id: result.lastID, // Get ID from sqlite result
                    sender_id: userId,
                    receiver_id: receiverId,
                    content: content,
                    timestamp: new Date().toISOString(),
                    type: 'chat'
                };

                // 3. Send message to receiver and sender
                onlineUsers.get(receiverId)?.send(JSON.stringify(fullMessage));
                connection.socket.send(JSON.stringify(fullMessage)); 
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });

    connection.socket.on('close', () => {
        onlineUsers.delete(userId);
    });
});

start();