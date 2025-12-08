import db from "../config/db.js";
import { nanoid } from "nanoid";

const insertMsgStmt = db.prepare(
  `INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
   VALUES (?, ?, ?, ?, strftime('%s','now'))`
);

const getMessagesStmt = db.prepare(
  `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?`
);

export default {
  create: (conversationId, senderId, content) => {
    const id = nanoid();
    insertMsgStmt.run(id, conversationId, senderId, content);
    return { id, conversation_id: conversationId, sender_id: senderId, content, created_at: Math.floor(Date.now()/1000) };
  },

  getConversationMessages: (conversationId, limit = 100) => {
    return getMessagesStmt.all(conversationId, limit);
  }
};