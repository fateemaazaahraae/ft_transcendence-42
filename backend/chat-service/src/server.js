import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import { openDb } from './database.js';
import jwt from 'jsonwebtoken';

const fastify = Fastify({ logger: true });

// Register plugins
await fastify.register(fastifyCors, {
  origin: true,
  credentials: true
});

await fastify.register(fastifyWebsocket);

// Initialize database
const db = await openDb();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store active WebSocket connections
const activeConnections = new Map<number, any>();

// Middleware to verify JWT
async function verifyToken(request: any, reply: any) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    request.user = decoded;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}

// WebSocket connection handler
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = parseInt(url.searchParams.get('user_id') || '0');

    if (!userId) {
      connection.socket.close();
      return;
    }

    // Store connection
    activeConnections.set(userId, connection);
    console.log(`User ${userId} connected`);

    // Update user status to online
    db.run('UPDATE users SET status = ? WHERE id = ?', ['online', userId]);

    // Broadcast online status to all connected users
    broadcastStatusUpdate(userId, 'online');

    connection.socket.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'chat') {
          // Save message to database
          const result = await db.run(
            'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, ?)',
            [userId, data.receiver_id, data.content, new Date().toISOString()]
          );

          // Get the saved message
          const savedMessage = await db.get(
            'SELECT * FROM messages WHERE id = ?',
            [result.lastID]
          );

          // Send to receiver if online
          const receiverConnection = activeConnections.get(data.receiver_id);
          if (receiverConnection) {
            receiverConnection.socket.send(JSON.stringify({
              type: 'chat',
              ...savedMessage
            }));
          }

          // Send back to sender as confirmation
          connection.socket.send(JSON.stringify({
            type: 'chat',
            ...savedMessage
          }));
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    connection.socket.on('close', async () => {
      activeConnections.delete(userId);
      console.log(`User ${userId} disconnected`);

      // Update user status to offline
      await db.run('UPDATE users SET status = ? WHERE id = ?', ['offline', userId]);

      // Broadcast offline status
      broadcastStatusUpdate(userId, 'offline');
    });
  });
});

// Broadcast status update to all connected users
function broadcastStatusUpdate(userId: number, status: string) {
  const statusMessage = JSON.stringify({
    type: 'status',
    user_id: userId,
    status: status
  });

  activeConnections.forEach((connection) => {
    try {
      connection.socket.send(statusMessage);
    } catch (error) {
      console.error('Error broadcasting status:', error);
    }
  });
}

// REST API Routes

// Get contacts with last message
fastify.get('/api/chats/contacts/:userId', async (request: any, reply) => {
  const { userId } = request.params;

  try {
    const contacts = await db.all(`
      SELECT DISTINCT
        u.id,
        u.userName as username,
        u.profileImage as avatar,
        COALESCE(u.status, 'offline') as status,
        (
          SELECT content
          FROM messages
          WHERE (sender_id = ? AND receiver_id = u.id)
             OR (sender_id = u.id AND receiver_id = ?)
          ORDER BY timestamp DESC
          LIMIT 1
        ) as last_message
      FROM users u
      WHERE u.id IN (
        SELECT DISTINCT
          CASE
            WHEN sender_id = ? THEN receiver_id
            WHEN receiver_id = ? THEN sender_id
          END as contact_id
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
      )
      ORDER BY (
        SELECT timestamp
        FROM messages
        WHERE (sender_id = ? AND receiver_id = u.id)
           OR (sender_id = u.id AND receiver_id = ?)
        ORDER BY timestamp DESC
        LIMIT 1
      ) DESC
    `, [userId, userId, userId, userId, userId, userId, userId, userId]);

    return reply.send(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return reply.code(500).send({ error: 'Failed to fetch contacts' });
  }
});

// Get messages between two users
fastify.get('/api/chats/messages/:userId/:contactId', async (request: any, reply) => {
  const { userId, contactId } = request.params;

  try {
    const messages = await db.all(`
      SELECT *
      FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `, [userId, contactId, contactId, userId]);

    return reply.send(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return reply.code(500).send({ error: 'Failed to fetch messages' });
  }
});

// Send message (REST endpoint as backup)
fastify.post('/api/chats/send', async (request: any, reply) => {
  const { sender_id, receiver_id, content } = request.body;

  try {
    const result = await db.run(
      'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, ?)',
      [sender_id, receiver_id, content, new Date().toISOString()]
    );

    const message = await db.get('SELECT * FROM messages WHERE id = ?', [result.lastID]);

    // Send to receiver if online
    const receiverConnection = activeConnections.get(receiver_id);
    if (receiverConnection) {
      receiverConnection.socket.send(JSON.stringify({
        type: 'chat',
        ...message
      }));
    }

    return reply.send(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return reply.code(500).send({ error: 'Failed to send message' });
  }
});

// Get user status
fastify.get('/api/chats/status/:userId', async (request: any, reply) => {
  const { userId } = request.params;

  try {
    const user = await db.get('SELECT status FROM users WHERE id = ?', [userId]);
    return reply.send({ status: user?.status || 'offline' });
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch status' });
  }
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'chat-service' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Chat service running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();