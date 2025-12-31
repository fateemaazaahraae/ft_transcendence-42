import db from "../config/db.js";
import { nanoid } from "nanoid";

const stmts = {
  insert: db.prepare(`INSERT INTO messages (id, conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, strftime('%s','now'))`),
  get: db.prepare(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?`)
};

export default {
  create: (convId, senderId, content) => {
    const id = nanoid();
    stmts.insert.run(id, convId, senderId, content);
    return { id, conversation_id: convId, sender_id: senderId, content, created_at: Math.floor(Date.now()/1000) };
  },
  getConversationMessages: (convId, limit = 100) => stmts.get.all(convId, limit)
};