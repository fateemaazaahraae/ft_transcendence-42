// src/routes/chatRoutes.js
export default async function chatRoutes(fastify) {
    const db = await fastify.sqliteDb;

    // --- Get Message History ---
    fastify.get('/messages/:user1Id/:user2Id', async (request, reply) => {
        // ... (Logic remains the same: select messages and mark as read)
        const { user1Id, user2Id } = request.params;
        
        const messages = await db.all(`
            SELECT id, sender_id, receiver_id, content, timestamp
            FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp ASC;
        `, user1Id, user2Id, user2Id, user1Id);
        
        await db.run('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0', user2Id, user1Id);

        return reply.send(messages);
    });

    // --- Get Contact IDs and Last Message ---
    // MODIFIED: Also checks if the contact is blocked by the current user (userId)
    fastify.get('/contacts/:userId', async (request, reply) => {
        const userId = request.params.userId;
        
        const contacts = await db.all(`
            SELECT 
                c.contact_id as id, 
                (
                    SELECT content FROM messages 
                    WHERE (sender_id = c.contact_id AND receiver_id = ?) 
                       OR (sender_id = ? AND receiver_id = c.contact_id) 
                    ORDER BY timestamp DESC LIMIT 1
                ) as last_message,
                CASE WHEN EXISTS (
                    SELECT 1 FROM blocked_users 
                    WHERE blocker_id = ? AND blocked_id = c.contact_id
                ) THEN 1 ELSE 0 END AS is_blocked
            FROM contacts c
            WHERE c.user_id = ?
            ORDER BY last_message_timestamp DESC;
        `, userId, userId, userId, userId);
        
        return reply.send(contacts);
    });

    // --- NEW: Block a User ---
    fastify.post('/block/:blockerId/:blockedId', async (request, reply) => {
        const { blockerId, blockedId } = request.params;
        try {
            await db.run(
                'INSERT INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)',
                blockerId, blockedId
            );
            return reply.send({ success: true, message: 'User blocked.' });
        } catch (error) {
            // Unique constraint error if already blocked
            return reply.status(409).send({ success: false, message: 'User already blocked.' });
        }
    });

    // --- NEW: Unblock a User ---
    fastify.delete('/unblock/:blockerId/:blockedId', async (request, reply) => {
        const { blockerId, blockedId } = request.params;
        await db.run(
            'DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
            blockerId, blockedId
        );
        return reply.send({ success: true, message: 'User unblocked.' });
    });
}